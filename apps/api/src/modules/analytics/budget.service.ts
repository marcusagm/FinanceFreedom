import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { startOfMonth, endOfMonth } from "date-fns";

@Injectable()
export class BudgetService {
    constructor(private prisma: PrismaService) {}

    async getBudgetStatus(userId: string, date?: Date) {
        const targetDate = date || new Date();
        const startDate = startOfMonth(targetDate);
        const endDate = endOfMonth(targetDate);
        const month = startDate.getMonth() + 1;
        const year = startDate.getFullYear();

        // Fetch categories
        const categories = await this.prisma.category.findMany({
            where: {
                userId,
                // We want all categories that have a limit OR a history for this month
                // Ideally we fetch all and filter, or complex query.
                // Given category count is low, fetching all active/relevant is fine.
            },
        });

        // Fetch budget history for this specific month
        const budgetHistories = await this.prisma.budgetHistory.findMany({
            where: {
                userId,
                month,
                year,
            },
        });

        const budgetStatus = await Promise.all(
            categories.map(async (category) => {
                // Determine limit priority: History > Default Category Limit
                const historyEntry = budgetHistories.find(
                    (h) => h.categoryId === category.id,
                );

                let limit = 0;
                if (historyEntry) {
                    limit = Number(historyEntry.amount);
                } else if (category.budgetLimit) {
                    limit = Number(category.budgetLimit);
                }

                // If limit is 0, we might skip it or show it as unbudgeted?
                // The original logic filtered by budgetLimit > 0.
                // We should probably include it if limit > 0 OR spent > 0?
                // For now, let's keep consistency: if limit > 0 it shows up.

                const transactions = await this.prisma.transaction.aggregate({
                    where: {
                        userId,
                        categoryId: category.id,
                        type: "EXPENSE",
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                });

                const spent = Number(transactions._sum.amount || 0);

                if (limit === 0 && spent === 0) {
                    return null; // Skip non-budgeted, non-spent categories
                }

                const percentage =
                    limit > 0
                        ? Math.min((spent / limit) * 100, 100)
                        : spent > 0
                          ? 100
                          : 0;

                // Determine status color/state
                let status = "NORMAL"; // < 75%
                if (percentage >= 90) {
                    status = "CRITICAL";
                } else if (percentage >= 75) {
                    status = "WARNING";
                }

                return {
                    categoryId: category.id,
                    categoryName: category.name,
                    categoryColor: category.color,
                    limit,
                    spent,
                    percentage,
                    remaining: Math.max(limit - spent, 0),
                    status,
                };
            }),
        );

        // Filter nulls and sort
        return budgetStatus
            .filter((b): b is NonNullable<typeof b> => b !== null)
            .sort((a, b) => b.percentage - a.percentage);
    }

    async upsertBudget(
        userId: string,
        categoryId: string,
        amount: number,
        date: Date,
    ) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const existing = await this.prisma.budgetHistory.findFirst({
            where: {
                userId,
                categoryId,
                month,
                year,
            },
        });

        if (existing) {
            return this.prisma.budgetHistory.update({
                where: { id: existing.id },
                data: { amount },
            });
        }

        return this.prisma.budgetHistory.create({
            data: {
                userId,
                categoryId,
                amount,
                month,
                year,
            },
        });
    }

    async getIncomeDistribution(userId: string, targetDate: Date = new Date()) {
        const categories = await this.prisma.category.findMany({
            where: {
                userId,
                type: "INCOME",
            },
        });

        // Also fetch transactions with no category or income matching categories
        const startDate = startOfMonth(targetDate);
        const endDate = endOfMonth(targetDate);

        const incomeStatus = await Promise.all(
            categories.map(async (category) => {
                const transactions = await this.prisma.transaction.aggregate({
                    where: {
                        userId,
                        categoryId: category.id,
                        type: "INCOME",
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                });

                const received = Number(transactions._sum.amount || 0);
                const goal = Number(category.budgetLimit || 0);
                const percentage =
                    goal > 0 ? Math.min((received / goal) * 100, 100) : 0;

                return {
                    categoryId: category.id,
                    categoryName: category.name,
                    categoryColor: category.color,
                    received,
                    goal,
                    percentage,
                };
            }),
        );

        return incomeStatus.sort((a, b) => b.received - a.received);
    }
}
