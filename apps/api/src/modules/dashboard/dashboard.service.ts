import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) {}

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

        // 3. 30-Day Evolution Chart data
        // For simplicity in this iteration, we will just return the summary numbers.
        // The chart data generation logic can be complex and might need a separate optimized query later.
        // However, to satisfy the requirement "Criar Gráfico de Linha (Evolução do Saldo - 30 dias)",
        // we need to construct the daily balance.
        // This is expensive to calculate on the fly by iterating all transactions every time.
        // A better approach for the MVP is:
        // Take the current balance and work backwards with transactions from the last 30 days?
        // Or just group transactions by date for the last 30 days.

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        // Get last 30 days transactions
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

        const chartData = [];
        // This is a simplified "daily flow" chart, not necessarily "balance evolution" if we don't have snapshots.
        // But we can approximate "balance evolution" if we assume the current balance is correct
        // and reverse-engineer previous days, OR we can just show "Income vs Expense" per day.
        // The requirement says "Evolução do Saldo".
        // Let's implement a 'reverse-calc' strategy:
        // currentBalance is for TODAY.
        // Balance Yesterday = Balance Today - Today's Income + Today's Expense.

        let runningBalance = totalBalance;

        // We need a map of transactions per day
        const transactionsMap = new Map<
            string,
            { income: number; expense: number }
        >();

        // Helper to format date as YYYY-MM-DD
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

        // Iterate backwards from today to 30 days ago
        const days = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateKey = formatDate(date);
            days.push({ date: dateKey, dateObj: date });
        }
        // Sort days chronologically (oldest to newest) to build the chart
        days.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

        // Wait, to build the chart specifically for "Balance Evolution", we should do:
        // Start with Current Balance. This is the balance at the END of today.
        // Walk BACKWARDS day by day.

        const balanceEvolution = [];
        let currentCalcBalance = totalBalance;

        // We need to iterate backwards in time
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateKey = formatDate(date);

            // This is the balance at the end of 'date'.
            balanceEvolution.push({
                date: dateKey,
                balance: currentCalcBalance,
            });

            // Now adjust currentCalcBalance to be the balance at the end of 'yesterday' (date - 1)
            // Balance(Yesterday) = Balance(Today) - Income(Today) + Expense(Today)
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
            chartData: balanceEvolution.reverse(), // Return oldest to newest
        };
    }
}
