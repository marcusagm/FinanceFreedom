import { Injectable } from "@nestjs/common";
import { CreateDebtDto } from "./dto/create-debt.dto";
import { UpdateDebtDto } from "./dto/update-debt.dto";
import { PrismaService } from "../../prisma/prisma.service";

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
}
