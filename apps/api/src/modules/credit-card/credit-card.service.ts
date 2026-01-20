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

    async findAll(userId: string) {
        return this.prisma.creditCard.findMany({
            where: { userId },
            include: {
                paymentAccount: true,
                account: true,
            },
        });
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
        return card;
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

        return this.prisma.creditCard.delete({
            where: { id },
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
            orderBy: { date: "desc" },
        });

        const total = transactions.reduce((acc, t) => {
            return t.type === "EXPENSE"
                ? acc + Number(t.amount)
                : acc - Number(t.amount);
        }, 0);

        return {
            period: {
                start: startDate,
                end: endDate,
            },
            status: new Date() > endDate ? "CLOSED" : "OPEN",
            total,
            transactions,
        };
    }
}
