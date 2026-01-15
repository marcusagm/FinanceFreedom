import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { startOfMonth, endOfMonth } from "date-fns";

@Injectable()
export class BudgetService {
    constructor(private prisma: PrismaService) {}

    async getBudgetStatus(userId: string) {
        const categories = await this.prisma.category.findMany({
            where: {
                userId,
                budgetLimit: {
                    gt: 0,
                },
            },
        });

        const startDate = startOfMonth(new Date());
        const endDate = endOfMonth(new Date());

        const budgetStatus = await Promise.all(
            categories.map(async (category) => {
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
                const limit = Number(category.budgetLimit);
                const percentage = Math.min((spent / limit) * 100, 100);

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
            })
        );

        // Sort by highest percentage usage
        return budgetStatus.sort((a, b) => b.percentage - a.percentage);
    }

    async getIncomeDistribution(userId: string) {
        const categories = await this.prisma.category.findMany({
            where: {
                userId,
                type: "INCOME",
            },
        });

        // Also fetch transactions with no category or income matching categories
        const startDate = startOfMonth(new Date());
        const endDate = endOfMonth(new Date());

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
            })
        );

        return incomeStatus.sort((a, b) => b.received - a.received);
    }
}
