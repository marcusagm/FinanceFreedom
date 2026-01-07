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
    async getSortedDebts(strategyType: "SNOWBALL" | "AVALANCHE") {
        const debts = await this.findAll();
        const strategy =
            strategyType === "SNOWBALL"
                ? new SnowballStrategy()
                : new AvalancheStrategy();

        return strategy.sort(debts);
    }
}
