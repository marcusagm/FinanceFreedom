import { Injectable } from "@nestjs/common";
import { CreateDebtDto } from "./dto/create-debt.dto";
import { UpdateDebtDto } from "./dto/update-debt.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { SnowballStrategy } from "./strategies/snowball.strategy";
import { AvalancheStrategy } from "./strategies/avalanche.strategy";

@Injectable()
export class DebtService {
    constructor(private readonly prisma: PrismaService) {}

    create(createDebtDto: CreateDebtDto) {
        return this.prisma.debt.create({
            data: createDebtDto,
        });
    }

    findAll() {
        return this.prisma.debt.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    findOne(id: string) {
        return this.prisma.debt.findUnique({
            where: { id },
        });
    }

    update(id: string, updateDebtDto: UpdateDebtDto) {
        return this.prisma.debt.update({
            where: { id },
            data: updateDebtDto,
        });
    }

    remove(id: string) {
        return this.prisma.debt.delete({
            where: { id },
        });
    }
    async getSortedDebts(
        strategyType: "SNOWBALL" | "AVALANCHE",
        monthlyExtra = 0
    ) {
        const debts = await this.findAll();
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
            let availableExtra = monthlyExtra;

            // 1. Apply Interest
            // 2. Pay Minimums
            for (const debt of currentDebts) {
                if (debt.currentBalance <= 0) continue;

                const interest =
                    debt.currentBalance * (Number(debt.interestRate) / 100);
                totalInterestPaid += interest;
                debt.currentBalance += interest;

                let payment = Number(debt.minimumPayment);
                if (payment > debt.currentBalance)
                    payment = debt.currentBalance;

                debt.currentBalance -= payment;
            }

            // 3. Pay Extra to Priority Debt (First in list that has balance)
            for (const debt of currentDebts) {
                if (availableExtra <= 0) break;
                if (debt.currentBalance <= 0) continue;

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
