import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class SimulatorService {
    constructor(private readonly prisma: PrismaService) {}

    async calculateHourlyRate(): Promise<number> {
        // 1. Get total active income in the last 30 days
        // For MVP, we sum all INCOME transactions in the current month or last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const aggregates = await this.prisma.transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                type: "INCOME",
                date: {
                    gte: thirtyDaysAgo,
                },
            },
        });

        const totalIncome = aggregates._sum.amount?.toNumber() || 0;

        // Default to 160 hours/month (40h/week)
        const workHours = 160;

        if (totalIncome === 0) return 0;

        return totalIncome / workHours;
    }

    async calculateDelayCost(
        debtBalance: number,
        monthlyInterestRate: number,
        daysLate: number,
        debtName = "Dívida"
    ) {
        // Pure logic refactor - Decoupled from Account/DB for Plan 005.5
        const monthlyRate = monthlyInterestRate; // %

        if (debtBalance === 0 || monthlyRate === 0) {
            return {
                cost: 0,
                message: "No impact (Zero balance or 0% interest)",
            };
        }

        // Daily Rate (Simple approx: Rate / 30)
        // Compound: (1 + rate)^days - 1
        // Rate is percent, e.g. 10.0 for 10%
        const rateDecimal = monthlyRate / 100;
        const dailyRate = rateDecimal / 30;

        // Simple Interest for short delays is usually Close Enough and what banks often charge as "Mora" + "Multa"
        // Usually Multa (2%) + Juros (1% ao mes pro-rata)
        // Let's implement Brazil Standard: Multa 2% fixed + Juros 1% pro-rata

        const fine = debtBalance * 0.02; // Multa is strict 2% usually
        const interest = debtBalance * (dailyRate * daysLate);

        const totalCost = fine + interest;

        return {
            debtName: debtName,
            daysLate,
            fine,
            interest,
            totalCost,
            comparison: this.getComparison(totalCost),
        };
    }

    async calculatePrepaymentSavings(
        debtBalance: number,
        monthlyInterestRate: number,
        minimumPayment: number,
        prepaymentAmount: number
    ) {
        // Pure logic refactor - Decoupled from Account/DB for Plan 005.5
        const monthlyRate = monthlyInterestRate; // %

        if (debtBalance === 0 || monthlyRate === 0) {
            return { saved: 0, message: "No savings possible" };
        }

        const minPayment = minimumPayment || debtBalance * 0.05;

        if (minPayment <= 0)
            return { saved: 0, message: "Invalid minimum payment" };

        // Function to calc total interest paid until zero
        const calcTotalInterest = (
            balance: number,
            payment: number,
            rate: number
        ) => {
            let currentBalance = balance;
            let totalInterest = 0;
            let months = 0;
            // Cap at 120 months to avoid infinite loops in bad scenarios
            while (currentBalance > 0 && months < 120) {
                const interest = currentBalance * (rate / 100);
                totalInterest += interest;
                currentBalance = currentBalance + interest - payment;
                months++;
                if (currentBalance > balance * 2) break; // Runaway debt
            }
            return totalInterest;
        };

        const currentTotalInterest = calcTotalInterest(
            debtBalance,
            minPayment,
            monthlyRate
        );

        // Scenario 2: Immediate Prepayment
        const newBalance = debtBalance - prepaymentAmount;
        const newTotalInterest = calcTotalInterest(
            newBalance,
            minPayment,
            monthlyRate
        );

        // Savings is the difference in Interest + The Principal you didn't have to pay later?
        // Actually "Savings" is usually just the Interest Avoided.
        const interestSaved = currentTotalInterest - newTotalInterest;

        return {
            prepaymentAmount,
            interestSaved: Math.max(0, interestSaved),
            monthsSaved: 0, // TODO: Calculate months difference too
        };
    }

    private getComparison(amount: number): string {
        if (amount < 20) return "Equivalent to a Streaming Subscription";
        if (amount < 50) return "Equivalent to a Lunch";
        if (amount < 200) return "Equivalent to a Weekly Grocery Shop";
        return "Equivalent to a Weekend Trip";
    }
}
