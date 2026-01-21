import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
    CreateCreditCardDto,
    UpdateCreditCardDto,
} from "./dto/credit-card.dto";
import { startOfDay, endOfDay, subMonths, addDays, setDate } from "date-fns";

@Injectable()
export class CreditCardService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, createCreditCardDto: CreateCreditCardDto) {
        return this.prisma.$transaction(async (prisma) => {
            // 1. Create the Account that represents this card
            const account = await prisma.account.create({
                data: {
                    name: createCreditCardDto.name,
                    type: "CREDIT_CARD",
                    userId,
                    currency: "BRL", // Default or should come from DTO?
                    balance: 0,
                },
            });

            // 2. Create the CreditCard linked to that account
            return prisma.creditCard.create({
                data: {
                    ...createCreditCardDto,
                    accountId: account.id,
                    userId,
                },
            });
        });
    }

    private mapCreditCardResponse(card: any) {
        return {
            ...card,
            limit: Number(card.limit),
            account: card.account
                ? {
                      ...card.account,
                      balance: Number(card.account.balance),
                  }
                : null,
            paymentAccount: card.paymentAccount
                ? {
                      ...card.paymentAccount,
                      balance: Number(card.paymentAccount.balance),
                  }
                : null,
        };
    }

    async findAll(userId: string) {
        const cards = await this.prisma.creditCard.findMany({
            where: { userId },
            include: {
                paymentAccount: true,
                account: true,
            },
        });
        return cards.map(this.mapCreditCardResponse);
    }

    async findOne(userId: string, id: string) {
        const card = await this.prisma.creditCard.findFirst({
            where: { id, userId },
            include: {
                paymentAccount: true,
                account: true,
            },
        });

        if (!card) {
            throw new NotFoundException(`Credit Card with ID ${id} not found`);
        }
        return this.mapCreditCardResponse(card);
    }

    async update(
        userId: string,
        id: string,
        updateCreditCardDto: UpdateCreditCardDto,
    ) {
        const card = await this.findOne(userId, id); // Ensure exists and belongs to user

        return this.prisma.creditCard.update({
            where: { id },
            data: updateCreditCardDto,
        });
    }

    async remove(userId: string, id: string) {
        // Optional: Check if there are transactions?
        // Cascading delete might be dangerous if implicit.
        const card = await this.findOne(userId, id);

        return this.prisma.$transaction(async (tx) => {
            await tx.creditCard.delete({
                where: { id },
            });
            await tx.account.delete({
                where: { id: card.accountId },
            });
        });
    }

    async calculateAvailableLimit(
        userId: string,
        cardId: string,
    ): Promise<number> {
        const card = await this.findOne(userId, cardId);
        const limit = Number(card.limit);
        const balance = Number(card.account.balance);

        // Account balance for Credit Card is negative when used.
        // Limit 1000. Balance -100. Available = 1000 + (-100) = 900.
        // However, if user "Overpaid" or has positive balance?
        // Available = 1000 + 100 = 1100.

        return limit + balance;
    }

    async getInvoice(
        userId: string,
        cardId: string,
        month: number,
        year: number,
    ) {
        const card = await this.findOne(userId, cardId);

        // Calculate date range based on closing day
        // Example: Closing Day 25.
        // Invoice for March (3) 2024.
        // Opens: Feb 26, 2024.
        // Closes: Mar 25, 2024.

        let startDate: Date;
        let endDate: Date;

        // If closing day is late in month (e.g. 25), the "Month" of the invoice usually refers to the Due Date month.
        // If due day is 05, closing is 25 of previous month.
        // Let's assume the `month` param is the month the invoice CLOSES.

        const closingDate = new Date(year, month - 1, card.closingDay);
        endDate = endOfDay(closingDate);

        const previousMonthClosing = new Date(year, month - 2, card.closingDay);
        startDate = startOfDay(addDays(previousMonthClosing, 1));

        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                creditCardId: cardId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                categoryRel: true,
            },
            orderBy: { date: "desc" },
        });

        const total = transactions.reduce((acc, t) => {
            // Expenses are negative in DB, effectively adding to the invoice (positive debt)
            // Income/Payments are positive, effectively reducing the invoice
            return acc - Number(t.amount);
        }, 0);

        // Due Date is usually X days after closing, or fixed day.
        // Assuming simple fixed day for now (e.g. Due Day 10 of Next Month if Closing is 25)
        // If Closing Day > Due Day, Due Date is Next Month.
        // Logic: Due Date Month is same as Closing Date Month if Due Day > Closing Day (rare).
        // Usually Due Date is next month.

        let dueMonth = month - 1; // 0-indexed
        let dueYear = year;

        // If Due Day < Closing Day, it means it's due in the NEXT month relative to the closing month.
        // Example: Closes 25th Jan. Due 5th Feb.
        // If we assumed `month` param is the Closing Month (e.g. 1=Jan), then Due Date is in Feb.

        // Re-evaluating: user passed `month`/`year`.
        // If we treat `month` as the Reference Month for the invoice (usually the due month),
        // then `dueDate` is simply:
        const dueDate = new Date(year, month - 1, card.dueDay);

        return {
            period: {
                start: startDate,
                end: endDate,
            },
            status: new Date() > endDate ? "CLOSED" : "OPEN",
            total,
            dueDate,
            transactions: transactions.map((t) => ({
                ...t,
                amount: Number(t.amount),
                category: t.categoryRel,
            })),
        };
    }

    async payInvoice(
        userId: string,
        cardId: string,
        month: number,
        year: number,
        accountId: string,
    ) {
        const card = await this.findOne(userId, cardId);

        // 1. Get invoice total
        const invoice = await this.getInvoice(userId, cardId, month, year);
        const amount = invoice.total;

        if (amount <= 0) {
            throw new Error("Invoice has no amount to pay");
        }

        // 2. Perform payment transaction (Transfer)
        // We use prisma transaction to ensure atomicity
        return this.prisma.$transaction(async (tx) => {
            // Debit from payment account
            await tx.account.update({
                where: { id: accountId },
                data: { balance: { decrement: amount } },
            });

            // Credit to credit card account (reducing debt)
            await tx.account.update({
                where: { id: card.accountId },
                data: { balance: { increment: amount } },
            });

            // Create transaction record (Payment)
            // We might want to create a formal transaction linked to accounts
            // For now, simpler approach to satisfy the controller/test requirement
            // and business logic basics.

            return {
                paid: true,
                amount,
                date: new Date(),
            };
        });
    }
}
