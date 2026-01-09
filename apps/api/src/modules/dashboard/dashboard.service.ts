import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DebtService } from "../debt/debt.service";

@Injectable()
export class DashboardService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly debtService: DebtService
    ) {}

    async getSummary() {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
        );

        // 1. Total Balance (Sum of all accounts)
        const accounts = await this.prisma.account.findMany();
        const totalBalance = accounts.reduce(
            (sum, acc) => sum + Number(acc.balance),
            0
        );

        // 2. Monthly Income & Expenses
        const transactions = await this.prisma.transaction.findMany({
            where: {
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
        const recommendations = [];

        if (freeCashFlow > 0) {
            const { debts } = await this.debtService.getSortedDebts(
                "SNOWBALL",
                0
            );
            if (debts.length > 0) {
                const topDebt = debts[0];
                recommendations.push({
                    type: "PAY_DEBT",
                    title: `Pagar Dívida: ${topDebt.name}`,
                    description: `Você tem R$ ${freeCashFlow.toFixed(
                        2
                    )} livres. Use para abater sua dívida mais cara (${
                        topDebt.interestRate
                    }% a.m).`,
                    actionLabel: "Pagar Agora",
                    actionLink: `/debts`,
                    priority: "HIGH",
                });
            } else {
                recommendations.push({
                    type: "INVEST",
                    title: "Investir Excedente",
                    description: `Parabéns! Você tem R$ ${freeCashFlow.toFixed(
                        2
                    )} livres e nenhuma dívida. Que tal investir?`,
                    actionLabel: "Ver Investimentos",
                    actionLink: "/investments",
                    priority: "MEDIUM",
                });
            }
        } else if (freeCashFlow < 0) {
            recommendations.push({
                type: "INCOME_GAP",
                title: "Faltam Recursos",
                description: `Você está R$ ${Math.abs(freeCashFlow).toFixed(
                    2
                )} negativo neste mês. Considere fazer uma renda extra.`,
                actionLabel: "Ver Oportunidades",
                actionLink: "/income/opportunities",
                priority: "CRITICAL",
            });
        }

        // 4. Chart Data (Logic remains same, just ensuring return structure)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const last30DaysTransactions = await this.prisma.transaction.findMany({
            where: {
                date: {
                    gte: thirtyDaysAgo,
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

            balanceEvolution.push({
                date: dateKey,
                balance: currentCalcBalance,
            });

            const dayTrans = transactionsMap.get(dateKey) || {
                income: 0,
                expense: 0,
            };
            currentCalcBalance =
                currentCalcBalance - dayTrans.income + dayTrans.expense;
        }

        return {
            totalBalance,
            monthlyIncome: income,
            monthlyExpenses: expenses,
            chartData: balanceEvolution.reverse(),
            recommendations,
        };
    }
}
