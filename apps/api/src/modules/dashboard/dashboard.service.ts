import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DebtService } from "../debt/debt.service";
import { I18nService } from "nestjs-i18n";

export interface ActionRecommendation {
    type: "PAY_DEBT" | "INVEST" | "INCOME_GAP";
    title: string;
    description: string;
    actionLabel: string;
    actionLink: string;
    priority: "HIGH" | "MEDIUM" | "CRITICAL";
}

@Injectable()
export class DashboardService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly debtService: DebtService,
        private readonly i18n: I18nService,
    ) {}

    async getSummary(userId: string, lang: string) {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0,
        );

        // 1. Total Balance (Sum of all accounts)
        const accounts = await this.prisma.account.findMany({
            where: { userId },
        });
        const totalBalance = accounts.reduce(
            (sum, acc) => sum + Number(acc.balance),
            0,
        );

        // 1b. Total Invested
        const investments = await this.prisma.investmentAccount.findMany({
            where: { userId },
        });
        const totalInvested = investments.reduce(
            (sum, inv) => sum + Number(inv.balance),
            0,
        );

        // 1c. Total Debt
        const allDebts = await this.prisma.debt.findMany({ where: { userId } });
        const totalDebt = allDebts.reduce(
            (sum, d) => sum + Number(d.totalAmount),
            0,
        );

        const netWorth = totalBalance + totalInvested - totalDebt;

        // 2. Monthly Income & Expenses
        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });

        const income = transactions
            .filter((t) => t.type === "INCOME")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expenses = transactions
            .filter((t) => t.type === "EXPENSE")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        // 3. Recommendations
        const freeCashFlow = income - expenses;
        const recommendations: ActionRecommendation[] = [];

        const formatCurrency = (amount: number) => {
            return new Intl.NumberFormat(lang, {
                style: "currency",
                currency: lang.startsWith("pt") ? "BRL" : "USD",
            }).format(amount);
        };

        if (freeCashFlow > 0) {
            const { debts } = await this.debtService.getSortedDebts(
                userId,
                "SNOWBALL",
                0,
            );
            if (debts.length > 0) {
                const topDebt = debts[0];
                recommendations.push({
                    type: "PAY_DEBT",
                    title: this.i18n.translate("dashboard.payDebtTitle", {
                        lang,
                        args: { name: topDebt.name },
                    }),
                    description: this.i18n.translate("dashboard.payDebtDesc", {
                        lang,
                        args: {
                            amount: formatCurrency(freeCashFlow),
                            rate: topDebt.interestRate,
                        },
                    }),
                    actionLabel: this.i18n.translate("dashboard.actions.pay", {
                        lang,
                    }),
                    actionLink: `/debts`,
                    priority: "HIGH",
                });
            } else {
                recommendations.push({
                    type: "INVEST",
                    title: this.i18n.translate("dashboard.investTitle", {
                        lang,
                    }),
                    description: this.i18n.translate("dashboard.investDesc", {
                        lang,
                        args: { amount: formatCurrency(freeCashFlow) },
                    }),
                    actionLabel: this.i18n.translate(
                        "dashboard.actions.invest",
                        { lang },
                    ),
                    actionLink: "/investments",
                    priority: "MEDIUM",
                });
            }
        } else if (freeCashFlow < 0) {
            recommendations.push({
                type: "INCOME_GAP",
                title: this.i18n.translate("dashboard.gapTitle", { lang }),
                description: this.i18n.translate("dashboard.gapDesc", {
                    lang,
                    args: { amount: formatCurrency(Math.abs(freeCashFlow)) },
                }),
                actionLabel: this.i18n.translate(
                    "dashboard.actions.opportunity",
                    { lang },
                ),
                actionLink: "/income/opportunities",
                priority: "CRITICAL",
            });
        }

        // 4. Chart Data (Logic remains same, just ensuring return structure)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const last30DaysTransactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: thirtyDaysAgo,
                    lte: new Date(),
                },
            },
            orderBy: {
                date: "asc",
            },
        });

        const transactionsMap = new Map<
            string,
            { income: number; expense: number }
        >();
        const formatDate = (date: Date) => date.toISOString().split("T")[0];

        for (const t of last30DaysTransactions) {
            const dateKey = formatDate(t.date);
            if (!transactionsMap.has(dateKey)) {
                transactionsMap.set(dateKey, { income: 0, expense: 0 });
            }
            const entry = transactionsMap.get(dateKey)!;
            if (t.type === "INCOME") entry.income += Number(t.amount);
            else entry.expense += Number(t.amount);
        }

        let currentCalcBalance = totalBalance;
        const balanceEvolution = [];

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateKey = formatDate(date);

            const dayTrans = transactionsMap.get(dateKey) || {
                income: 0,
                expense: 0,
            };

            balanceEvolution.push({
                date: dateKey,
                balance: currentCalcBalance,
                income: dayTrans.income,
                expense: dayTrans.expense,
            });

            currentCalcBalance =
                currentCalcBalance - dayTrans.income + dayTrans.expense;
        }

        // 5. Annual Chart Data (Last 12 months)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        oneYearAgo.setDate(1); // Start from the beginning of that month

        const last12MonthsTransactions = await this.prisma.transaction.findMany(
            {
                where: {
                    userId,
                    date: {
                        gte: oneYearAgo,
                        lte: new Date(),
                    },
                },
                orderBy: {
                    date: "asc",
                },
            },
        );

        const annualMap = new Map<
            string,
            { income: number; expense: number }
        >();
        const formatMonth = (date: Date) =>
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                2,
                "0",
            )}`;

        for (const t of last12MonthsTransactions) {
            const monthKey = formatMonth(t.date);
            if (!annualMap.has(monthKey)) {
                annualMap.set(monthKey, { income: 0, expense: 0 });
            }
            const entry = annualMap.get(monthKey)!;
            if (t.type === "INCOME") entry.income += Number(t.amount);
            else entry.expense += Number(t.amount);
        }

        let currentAnnualBalance = totalBalance;
        const annualEvolution = [];

        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(today.getMonth() - i);
            const monthKey = formatMonth(date);

            const monthTrans = annualMap.get(monthKey) || {
                income: 0,
                expense: 0,
            };

            annualEvolution.push({
                date: monthKey,
                balance: currentAnnualBalance,
                income: monthTrans.income,
                expense: monthTrans.expense,
            });

            // For annual, we are going backwards from current balance.
            // Previous month balance = Current - Net Income of Current Month
            currentAnnualBalance =
                currentAnnualBalance - monthTrans.income + monthTrans.expense;
        }

        return {
            totalBalance,
            totalInvested,
            totalDebt,
            netWorth,
            monthlyIncome: income,
            monthlyExpenses: expenses,
            chartData: balanceEvolution.reverse(),
            annualChartData: annualEvolution.reverse(),
            recommendations,
        };
    }
}
