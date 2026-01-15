import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class HealthScoreService {
    private readonly logger = new Logger(HealthScoreService.name);

    constructor(private prisma: PrismaService) {}

    async calculateScore(userId: string) {
        try {
            this.logger.log(`Calculating score for user: ${userId}`);
            let score = 1000;
            let debtPenalty = 0;
            let investmentBonus = 0;
            let reserveBonus = 0;

            // 1. Fetch Data
            const [debts, investments, accounts, incomeSources, fixedExpenses] =
                await Promise.all([
                    this.prisma.debt.findMany({ where: { userId } }),
                    this.prisma.investmentAccount.findMany({
                        where: { userId },
                    }),
                    this.prisma.account.findMany({ where: { userId } }),
                    this.prisma.incomeSource.findMany({ where: { userId } }),
                    this.prisma.fixedExpense.findMany({ where: { userId } }),
                ]);

            this.logger.log(
                `Fetched data for user ${userId}: Debts: ${debts.length}, Inv: ${investments.length}, Acc: ${accounts.length}`
            );

            // 2. Logic

            // --- DEBTS ---
            // Calculate Total Debt
            const totalDebt = debts.reduce(
                (sum, debt) => sum + Number(debt.totalAmount),
                0
            );

            // Calculate Monthly Income (Estimate)
            const monthlyIncome = incomeSources.reduce(
                (sum, income) => sum + Number(income.amount),
                0
            );

            // Penalty: Debt > 50% of Annual Income? Or Monthly payments?
            // Let's keep it simple: Debt to Income Ratio (DTI)
            // If Total Debt > 6x Monthly Income (6 months of salary indebted) -> Heavy penalty
            // Or using simple monthly DTI if we had monthly payments.
            // Let's use the plan's suggestion: "Dívidas > 50% renda" (Assuming monthly installment sum > 50% income)

            // We can estimate monthly debt payment if we don't have it explicitly calculated yet.
            // Debt model has `minimumPayment`, but maybe `installmentsTotal` implies something.
            // Let's use a simpler heuristic for now:
            // Presence of ANY debt gives a small penalty? No, debt is normal.
            // Let's say: If you have debts, we penalize based on count? No.

            // Implemented Logic:
            // Penalty 1: High Debt. If Total Debt > 3 * Monthly Income -> -200 points.
            if (monthlyIncome > 0 && totalDebt > 3 * monthlyIncome) {
                debtPenalty += 200;
            } else if (monthlyIncome > 0 && totalDebt > 1 * monthlyIncome) {
                debtPenalty += 100;
            }

            // Penalty 2: Count of debts. -20 per debt source.
            debtPenalty += debts.length * 20;

            // --- INVESTMENTS ---
            const totalInvested = investments.reduce(
                (sum, inv) => sum + Number(inv.balance),
                0
            );
            if (totalInvested > 0) {
                investmentBonus += 50; // Started investing

                // Bonus: Invested > 1x Monthly Income
                if (monthlyIncome > 0 && totalInvested > monthlyIncome) {
                    investmentBonus += 50;
                }
                // Bonus: Invested > 6x Monthly Income
                if (monthlyIncome > 0 && totalInvested > 6 * monthlyIncome) {
                    investmentBonus += 100;
                }
            }

            // --- RESERVES (Liquidity) ---
            const totalCash = accounts.reduce(
                (sum, acc) => sum + Number(acc.balance),
                0
            );

            // Estimate Monthly Expenses (Fixed + average variable?)
            // Let's use FixedExpenses sum as a baseline for "Essentials"
            const monthlyFixedExpenses = fixedExpenses.reduce(
                (sum, exp) => sum + Number(exp.amount),
                0
            );
            // Add a buffer for variable expenses (e.g. +50%)
            const estimatedMonthlySpend = monthlyFixedExpenses * 1.5;

            // Reserve Bonus: > 3 months of expenses
            if (
                estimatedMonthlySpend > 0 &&
                totalCash > 3 * estimatedMonthlySpend
            ) {
                reserveBonus += 100;
            } else if (
                estimatedMonthlySpend > 0 &&
                totalCash > 1 * estimatedMonthlySpend
            ) {
                reserveBonus += 50;
            }

            // Final Calculation
            score = score - debtPenalty + investmentBonus + reserveBonus;

            // Cap score 0-1000
            score = Math.max(0, Math.min(1000, score));

            // Save History
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check if already calculated today
            const existing = await this.prisma.dailyHealthScore.findFirst({
                where: {
                    userId,
                    date: today,
                },
            });

            if (existing) {
                await this.prisma.dailyHealthScore.update({
                    where: { id: existing.id },
                    data: {
                        score,
                        debtPenalty,
                        investmentBonus,
                        reserveBonus,
                    },
                });
            } else {
                await this.prisma.dailyHealthScore.create({
                    data: {
                        userId,
                        score,
                        date: today,
                        debtPenalty,
                        investmentBonus,
                        reserveBonus,
                    },
                });
            }

            return {
                score,
                details: {
                    base: 1000,
                    penalties: {
                        debt: debtPenalty,
                    },
                    bonuses: {
                        investments: investmentBonus,
                        reserves: reserveBonus,
                    },
                },
            };
        } catch (error) {
            this.logger.error(
                `Error calculating health score for user ${userId}`,
                error.stack
            );
            throw error;
        }
    }

    async getLatestScore(userId: string) {
        const latest = await this.prisma.dailyHealthScore.findFirst({
            where: { userId },
            orderBy: { date: "desc" },
        });

        if (!latest) {
            // Calculate on the fly if never calculated
            return this.calculateScore(userId);
        }

        return {
            score: latest.score,
            details: {
                base: 1000,
                penalties: {
                    debt: latest.debtPenalty,
                },
                bonuses: {
                    investments: latest.investmentBonus,
                    reserves: latest.reserveBonus,
                },
            },
            date: latest.date,
        };
    }
}
