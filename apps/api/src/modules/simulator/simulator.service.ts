import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class SimulatorService {
    constructor(private readonly prisma: PrismaService) {}

    calculateTimeCost(amount: number, hourlyRate: number): number {
        if (!hourlyRate || hourlyRate <= 0) return 0;
        return amount / hourlyRate;
    }

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
        const monthlyRate = monthlyInterestRate; // %

        if (debtBalance === 0 || monthlyRate === 0) {
            return {
                totalCost: 0,
                fine: 0,
                interest: 0,
                daysLate: 0,
                debtName: debtName,
                comparison: "N/A",
                message: "No impact (Zero balance or 0% interest)",
            };
        }

        const rateDecimal = monthlyRate / 100;
        const dailyRate = rateDecimal / 30;

        const fine = debtBalance * 0.02; // Multa 2%
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
        const monthlyRate = monthlyInterestRate; // %

        if (debtBalance === 0 || monthlyRate === 0) {
            return {
                interestSaved: 0,
                monthsSaved: 0,
                prepaymentAmount: prepaymentAmount || 0,
                message: "No savings possible",
            };
        }

        const minPayment = minimumPayment || debtBalance * 0.05;

        if (minPayment <= 0)
            return {
                interestSaved: 0,
                monthsSaved: 0,
                prepaymentAmount: prepaymentAmount || 0,
                message: "Invalid minimum payment",
            };

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
