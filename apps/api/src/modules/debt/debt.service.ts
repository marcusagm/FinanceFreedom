import { Injectable } from "@nestjs/common";
import { CreateDebtDto } from "./dto/create-debt.dto";
import { UpdateDebtDto } from "./dto/update-debt.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { SnowballStrategy } from "./strategies/snowball.strategy";
import { AvalancheStrategy } from "./strategies/avalanche.strategy";

@Injectable()
export class DebtService {
    constructor(private readonly prisma: PrismaService) {}

    create(userId: string, createDebtDto: CreateDebtDto) {
        const { firstInstallmentDate, ...rest } = createDebtDto;
        return this.prisma.debt.create({
            data: {
                ...rest,
                firstInstallmentDate: firstInstallmentDate
                    ? new Date(firstInstallmentDate)
                    : undefined,
                originalAmount: createDebtDto.totalAmount, // Capture original amount
                userId,
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.debt.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    findOne(userId: string, id: string) {
        return this.prisma.debt.findFirst({
            where: { id, userId },
        });
    }

    async update(userId: string, id: string, updateDebtDto: UpdateDebtDto) {
        const debt = await this.prisma.debt.findFirstOrThrow({
            where: { id, userId },
        });
        const { firstInstallmentDate, ...rest } = updateDebtDto;

        // Logic to update totalAmount (Current Balance) based on paid installments
        let newTotalAmount = rest.totalAmount;
        if (
            rest.installmentsPaid !== undefined &&
            rest.installmentsPaid !== debt.installmentsPaid
        ) {
            // Installments changed.
            // If we have originalAmount and installmentsTotal, we can calculate strictly.
            // If originalAmount is missing (old debt), we assume totalAmount was current.
            // To support "Decreasing Balance correctly":
            // We should use originalAmount as the anchor.

            if (
                debt.originalAmount &&
                rest.installmentsTotal &&
                rest.installmentsTotal > 0
            ) {
                // CASE A: We have originalAmount. Calculate strictly.
                const anchorAmount = Number(debt.originalAmount);
                const installmentValue = anchorAmount / rest.installmentsTotal;
                const paid = rest.installmentsPaid;
                const calculatedBalance =
                    anchorAmount - installmentValue * paid;
                newTotalAmount = calculatedBalance > 0 ? calculatedBalance : 0;
            } else {
                // CASE B: Missing originalAmount (Legacy Debt). Use Differential Update.
                // We assume current debt.totalAmount is correct relative to debt.installmentsPaid.
                // If we pay more, balance decreases. If we unpay, balance increases.

                // Estimate installment value from current data if possible, or use minimumPayment.
                // Best guess: If we knew previous installs, we could reverse engineer.
                // But we only have current snapshot `debt`.

                // Let's use `minimumPayment` as the Installment Value if available and creates sense.
                const installmentValue =
                    Number(debt.minimumPayment) > 0
                        ? Number(debt.minimumPayment)
                        : 0;

                if (installmentValue > 0) {
                    const diff = rest.installmentsPaid - debt.installmentsPaid; // e.g. 2 - 1 = 1 (Paid one). 1 - 2 = -1 (Unpaid one).
                    const currentBalance = Number(debt.totalAmount);

                    // New Balance = Current - (Diff * Value)
                    // If Diff is +1, Balance - Value.
                    // If Diff is -1, Balance - (-Value) = Balance + Value.
                    newTotalAmount = currentBalance - diff * installmentValue;
                }
            }
        }

        return this.prisma.debt.update({
            where: { id },
            data: {
                ...rest,
                totalAmount: newTotalAmount,
                firstInstallmentDate: firstInstallmentDate
                    ? new Date(firstInstallmentDate)
                    : undefined,
            },
        });
    }

    async remove(userId: string, id: string) {
        await this.prisma.debt.findFirstOrThrow({ where: { id, userId } });
        return this.prisma.debt.delete({
            where: { id },
        });
    }
    async getSortedDebts(
        userId: string,
        strategyType: "SNOWBALL" | "AVALANCHE",
        monthlyExtra = 0
    ) {
        const debts = await this.findAll(userId);
        const strategy =
            strategyType === "SNOWBALL"
                ? new SnowballStrategy()
                : new AvalancheStrategy();

        const sortedDebts = strategy.sort(debts);
        const projection = this.calculateProjection(sortedDebts, monthlyExtra);

        return {
            debts: sortedDebts,
            projection,
        };
    }

    private calculateProjection(debts: any[], monthlyExtra: number) {
        // value copy to avoid mutation
        let currentDebts = debts.map((d) => ({
            ...d,
            currentBalance: Number(d.totalAmount),
        }));
        let totalInterestPaid = 0;
        let months = 0;

        // Safety break to avoid infinite loops
        while (currentDebts.some((d) => d.currentBalance > 0) && months < 360) {
            months++;
            const currentSimulationDate = new Date();
            currentSimulationDate.setMonth(
                currentSimulationDate.getMonth() + months
            );

            let availableExtra = monthlyExtra;

            // 1. Apply Interest
            // 2. Pay Minimums
            for (const debt of currentDebts) {
                if (debt.currentBalance <= 0) continue;

                // Update: Check if debt has started based on firstInstallmentDate
                if (debt.firstInstallmentDate) {
                    const firstDate = new Date(debt.firstInstallmentDate);
                    // If simulation date is before first installment date (ignoring days for simplicity or being precise)
                    // Let's compare Month and Year
                    if (currentSimulationDate.getTime() < firstDate.getTime()) {
                        continue; // Skip interest and payment for this debt yet?
                        // Usually interest accumulates? But for "Parcelado" maybe not.
                        // Let's assume strict start: no activity before first date.
                    }
                }

                const interest =
                    debt.currentBalance * (Number(debt.interestRate) / 100);
                totalInterestPaid += interest;
                debt.currentBalance += interest;

                let payment = Number(debt.minimumPayment);

                // Update: Stop paying if we exceeded total installments?
                // Difficult to track here without "installmentsPaid" counter in simulation.
                // Assuming balance 0 check handles it for now.

                if (payment > debt.currentBalance)
                    payment = debt.currentBalance;

                debt.currentBalance -= payment;
            }

            // 3. Pay Extra to Priority Debt (First in list that has balance AND has started)
            for (const debt of currentDebts) {
                if (availableExtra <= 0) break;
                if (debt.currentBalance <= 0) continue;

                if (debt.firstInstallmentDate) {
                    const firstDate = new Date(debt.firstInstallmentDate);
                    if (currentSimulationDate.getTime() < firstDate.getTime()) {
                        continue;
                    }
                }

                let payment = availableExtra;
                if (payment > debt.currentBalance)
                    payment = debt.currentBalance;

                debt.currentBalance -= payment;
                availableExtra -= payment;
            }
        }

        return {
            monthsToPayoff: months,
            totalInterest: totalInterestPaid,
            savedInterest: 0, // Placeholder, requires baseline comparison
        };
    }
}
