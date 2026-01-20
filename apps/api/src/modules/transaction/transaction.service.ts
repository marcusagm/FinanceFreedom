import {
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { SplitTransactionDto } from "./dto/split-transaction.dto";
import { GetTransactionsDto } from "./dto/get-transactions.dto";
import { addMonths } from "date-fns";

import { MultiCurrencyService } from "../currency/services/multi-currency.service";
import { CreditCardService } from "../credit-card/credit-card.service";
import { forwardRef } from "@nestjs/common";

@Injectable()
export class TransactionService {
    constructor(
        @Inject(PrismaService) private readonly prisma: PrismaService,
        private readonly multiCurrencyService: MultiCurrencyService,
        @Inject(forwardRef(() => CreditCardService))
        private readonly creditCardService: CreditCardService,
    ) {}

    async create(userId: string, createTransactionDto: CreateTransactionDto) {
        let {
            accountId,
            amount,
            type,
            date,
            isRecurring,
            repeatCount,
            paysInstallment, // Used locally or logic?
            currency,
            status: inputStatus,
            personId,
            creditCardId,
            installmentNumber,
            totalInstallments: inputTotalInstallments, // distinct name
            ...rest
        } = createTransactionDto;

        const transactionDate = new Date(date);
        let status = inputStatus || "CONFIRMED";
        let targetAccountId = accountId;

        // 1. Credit Card Logic Setup
        if (creditCardId) {
            const card = await this.creditCardService.findOne(
                userId,
                creditCardId,
            );
            // Override accountId to the Card's hidden account
            targetAccountId = card.accountId;

            // Check Limit
            const available =
                await this.creditCardService.calculateAvailableLimit(
                    userId,
                    creditCardId,
                );
            if (Number(amount) > available) {
                throw new BadRequestException("Insufficient credit limit"); // TODO: i18n
            }
        }

        const iterations =
            creditCardId && inputTotalInstallments && inputTotalInstallments > 1
                ? inputTotalInstallments
                : isRecurring
                  ? repeatCount || 12
                  : 1;

        // 2. Resolve Account & Currency
        const account = await this.prisma.account.findUnique({
            where: { id: targetAccountId },
        });
        if (!account) {
            throw new NotFoundException(`Account ${targetAccountId} not found`);
        }

        const accountCurrency = account.currency || "BRL";
        const transactionCurrency = currency || accountCurrency;

        let effectiveAmount = Number(amount);
        let exchangeRate = 1;

        if (transactionCurrency !== accountCurrency) {
            try {
                // If it's a Credit Card, usually conversions happen at the card brand rate.
                // But we simulate it here.
                exchangeRate = await this.multiCurrencyService.getExchangeRate(
                    transactionCurrency,
                    accountCurrency,
                    transactionDate,
                );
                effectiveAmount = Number(amount) * exchangeRate;
            } catch (error) {
                throw new BadRequestException(
                    `Could not convert currency: ${error.message}`,
                );
            }
        }

        // If installments, divide amount
        let installmentAmount = effectiveAmount;
        if (
            creditCardId &&
            inputTotalInstallments &&
            inputTotalInstallments > 1
        ) {
            // Logic: Total Purchase is Amount. Each installment is Amount / N.
            // OR: User entered "Monthly Installment Value"?
            // Standard: User enters TOTAL purchase.
            installmentAmount = effectiveAmount / inputTotalInstallments;

            // Fix precision issues?
            // Better: 100 / 3 = 33.33, 33.33, 33.34.
            // We'll handle simplistic division for now.
        }

        // Use interactive transaction to ensure atomicity
        return this.prisma.$transaction(
            async (prisma: Prisma.TransactionClient) => {
                const createdTransactions = [];
                let remainingAmount = effectiveAmount;

                for (let i = 0; i < iterations; i++) {
                    const currentDate = addMonths(transactionDate, i);

                    let currentAmount = installmentAmount;

                    // Specific logic for recurring vs installments
                    if (isRecurring) {
                        currentAmount = effectiveAmount; // Recurring repeats the full amount
                    } else if (
                        creditCardId &&
                        inputTotalInstallments &&
                        inputTotalInstallments > 1
                    ) {
                        // Penny adjustment for last installment
                        if (i === iterations - 1) {
                            currentAmount = remainingAmount;
                        } else {
                            currentAmount = Number(currentAmount.toFixed(2));
                            remainingAmount -= currentAmount;
                        }
                    }

                    // 3. Create the transaction
                    const transaction = await prisma.transaction.create({
                        data: {
                            userId,
                            accountId: targetAccountId,
                            amount: currentAmount,
                            originalAmount: isRecurring
                                ? Number(amount)
                                : inputTotalInstallments &&
                                    inputTotalInstallments > 1
                                  ? Number(amount) / inputTotalInstallments
                                  : Number(amount), // Approximation for display
                            originalCurrency: transactionCurrency,
                            exchangeRate: exchangeRate,
                            status,
                            personId,
                            type,
                            date: currentDate,
                            description: isRecurring
                                ? `${createTransactionDto.description} (${i + 1}/${iterations})`
                                : inputTotalInstallments &&
                                    inputTotalInstallments > 1
                                  ? `${createTransactionDto.description} (${i + 1}/${inputTotalInstallments})`
                                  : createTransactionDto.description,
                            category: createTransactionDto.category,
                            categoryId: createTransactionDto.categoryId,
                            debtId: createTransactionDto.debtId,

                            creditCardId: creditCardId,
                            installmentNumber:
                                creditCardId && inputTotalInstallments
                                    ? i + 1
                                    : undefined,
                            totalInstallments:
                                creditCardId && inputTotalInstallments
                                    ? inputTotalInstallments
                                    : undefined,
                        },
                    });
                    createdTransactions.push(transaction);

                    // 4. Update the account balance (If CONFIRMED)
                    if (status === "CONFIRMED") {
                        const balanceChange =
                            type === "INCOME" ? currentAmount : -currentAmount;

                        await prisma.account.update({
                            where: { id: targetAccountId },
                            data: { balance: { increment: balanceChange } },
                        });
                    }

                    // 5. Update debt balance if applicable (If CONFIRMED)
                    if (
                        createTransactionDto.debtId &&
                        type === "EXPENSE" &&
                        status === "CONFIRMED"
                    ) {
                        // ... (Debt logic unchanged)
                        // Note: If using credit card, debt payment might reduce debt but increase CC usage.
                        // Logic below reduces Debt Amount.
                        const debt = await prisma.debt.findFirst({
                            where: { id: createTransactionDto.debtId, userId },
                        });

                        if (debt) {
                            const newDebtBalance =
                                Number(debt.totalAmount) -
                                Number(currentAmount);

                            let newPaidCount = debt.installmentsPaid || 0;
                            if (createTransactionDto.paysInstallment) {
                                newPaidCount += 1;
                            }

                            await prisma.debt.update({
                                where: { id: createTransactionDto.debtId },
                                data: {
                                    totalAmount:
                                        newDebtBalance < 0 ? 0 : newDebtBalance,
                                    installmentsPaid: newPaidCount,
                                },
                            });
                        }
                    }
                }

                return createdTransactions[0]; // Return the first one created
            },
        );
    }

    async findAll(userId: string, query: GetTransactionsDto) {
        const {
            page = 1,
            limit = 50,
            search,
            accountId,
            categoryId,
            startDate,
            endDate,
            currency,
            status,
            personId,
        } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.TransactionWhereInput = {
            userId,
        };

        if (search) {
            where.description = { contains: search };
        }

        if (accountId && accountId !== "all") {
            where.accountId = accountId;
        }

        if (categoryId && categoryId !== "all") {
            where.categoryId = categoryId;
        }

        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        } else if (startDate) {
            where.date = { gte: new Date(startDate) };
        } else if (endDate) {
            where.date = { lte: new Date(endDate) };
        }

        if (currency) {
            where.originalCurrency = currency;
        }

        if (status) {
            where.status = status;
        }

        if (personId) {
            where.personId = personId;
        }

        const [data, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                take: limit,
                skip,
                orderBy: { date: "desc" },
                include: { account: true },
            }),
            this.prisma.transaction.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    findOne(userId: string, id: string) {
        return this.prisma.transaction.findFirst({
            where: { id, userId },
            include: { account: true },
        });
    }

    update(
        userId: string,
        id: string,
        updateTransactionDto: UpdateTransactionDto,
    ) {
        const {
            accountId,
            amount,
            type,
            date,
            isRecurring,
            repeatCount,
            ...rest
        } = updateTransactionDto;

        return this.prisma.$transaction(
            async (prisma: Prisma.TransactionClient) => {
                // 1. Get original transaction
                const oldTransaction = await prisma.transaction.findFirst({
                    where: { id, userId },
                    include: { account: true },
                });

                if (!oldTransaction) {
                    throw new NotFoundException(
                        `Transaction with ID ${id} not found`,
                    );
                }

                // 2. Revert balance on original account
                const oldBalanceChange =
                    oldTransaction.type === "INCOME"
                        ? Number(oldTransaction.amount)
                        : -Number(oldTransaction.amount);
                const revertedBalance =
                    Number(oldTransaction.account.balance) - oldBalanceChange;

                await prisma.account.update({
                    where: { id: oldTransaction.accountId },
                    data: { balance: revertedBalance },
                });

                // 3. Prepare new data
                // If accountId is changing, we need to handle that. For now assuming accountId might change OR stay same.
                // But we just reverted the old account. So now we act as if it's a new transaction.
                // However, if accountId DID NOT change, we updated the same account twice. Prisma handles this fine.

                const targetAccountId = accountId || oldTransaction.accountId;
                const targetAmount =
                    amount !== undefined
                        ? amount
                        : Number(oldTransaction.amount);
                const targetType = type || oldTransaction.type;

                // 4. Update the transaction record
                const updatedTransaction = await prisma.transaction.update({
                    where: { id },
                    data: {
                        accountId: targetAccountId,
                        amount: targetAmount,
                        type: targetType,
                        date: date ? new Date(date) : undefined,
                        ...rest,
                    },
                });

                // 5. Apply new balance to target account
                // Need to fetch target account again to get fresh balance (especially if it was the same as old account)
                const targetAccount = await prisma.account.findFirst({
                    where: { id: targetAccountId, userId },
                });

                if (!targetAccount) {
                    throw new NotFoundException(
                        `Account with ID ${targetAccountId} not found`,
                    );
                }

                const newBalanceChange =
                    targetType === "INCOME"
                        ? Number(targetAmount)
                        : -Number(targetAmount);
                const finalBalance =
                    Number(targetAccount.balance) + newBalanceChange;

                await prisma.account.update({
                    where: { id: targetAccountId },
                    data: { balance: finalBalance },
                });

                return updatedTransaction;
            },
        );
    }

    remove(userId: string, id: string) {
        return this.prisma.$transaction(
            async (prisma: Prisma.TransactionClient) => {
                // 1. Get transaction
                const transaction = await prisma.transaction.findFirst({
                    where: { id, userId },
                    include: { account: true },
                });

                if (!transaction) {
                    throw new NotFoundException(
                        `Transaction with ID ${id} not found`,
                    );
                }

                // 2. Revert balance
                const balanceChange =
                    transaction.type === "INCOME"
                        ? Number(transaction.amount)
                        : -Number(transaction.amount);
                const newBalance =
                    Number(transaction.account.balance) - balanceChange;

                await prisma.account.update({
                    where: { id: transaction.accountId },
                    data: { balance: newBalance },
                });

                // 3. Delete transaction
                return prisma.transaction.delete({
                    where: { id },
                });
            },
        );
    }

    async split(
        userId: string,
        id: string,
        splitTransactionDto: SplitTransactionDto,
    ) {
        const { splits } = splitTransactionDto;

        return this.prisma.$transaction(async (prisma) => {
            // 1. Get original transaction
            const originalTransaction = await prisma.transaction.findFirst({
                where: { id, userId },
                include: { account: true },
            });

            if (!originalTransaction) {
                throw new NotFoundException(
                    `Transaction with ID ${id} not found`,
                );
            }

            // 2. Validate total amount
            const totalSplitAmount = splits.reduce(
                (sum, split) => sum + Number(split.amount),
                0,
            );
            const originalAmount = Number(originalTransaction.amount);

            // Floating point tolerance check
            if (Math.abs(totalSplitAmount - originalAmount) > 0.01) {
                throw new BadRequestException(
                    "Sum of splits must equal original transaction amount",
                );
            }

            // 3. Create new transactions
            const createdTransactions = [];
            for (const split of splits) {
                const newTransaction = await prisma.transaction.create({
                    data: {
                        accountId: originalTransaction.accountId,
                        amount: split.amount,
                        type: originalTransaction.type,
                        date: originalTransaction.date,
                        description: split.description,
                        category:
                            split.category || originalTransaction.category,
                        debtId: originalTransaction.debtId, // Maintain debt link if exists?
                        // If linked to debt, we should technically handle debt balance updates carefully.
                        // Ideally, splitting shouldn't change total debt payment, just categorize it differently.
                        userId,
                    },
                });
                createdTransactions.push(newTransaction);
            }

            // 4. Delete original transaction
            // Note: We don't need to revert account balance because the total amount IN/OUT is the same.
            // We just swap one big transaction for N small ones.
            // BUT, if we delete the original using `remove` logic, it reverts balance.
            // So we should manually delete without reverting balance, OR revert and re-apply.
            // Simplest is: Delete original (without balance logic), let new ones exist.
            // Wait, create() updates balance!

            // Correction: The `create` calls above (step 3) WILL update the balance because they are simple `prisma.transaction.create`.
            // WAIT - `prisma.transaction.create` is the raw Prisma method, NOT `this.create`.
            // The raw prisma `create` DOES NOT update side-effects (Account Balance).
            // So:
            // - Original transaction exists. Balance is already impacted by it.
            // - We delete original transaction record. Balance remains as is (since we don't trigger revert logic).
            // - We create N new transaction records. Balance remains as is (since we use raw create).
            // - Net result: Account Balance is correct (Total amount didn't change).

            // However, what if we use `this.create`? Then we'd update balance N times.
            // Better to use raw prisma calls here inside $transaction for full control.

            await prisma.transaction.delete({
                where: { id },
            });

            return createdTransactions;
        });
    }
}
