import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateFixedExpenseDto } from "./dto/create-fixed-expense.dto";
import { UpdateFixedExpenseDto } from "./dto/update-fixed-expense.dto";

@Injectable()
export class FixedExpenseService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, dto: CreateFixedExpenseDto) {
        return this.prisma.fixedExpense.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.fixedExpense.findMany({
            where: { userId },
            include: {
                category: true,
                account: true,
            },
        });
    }

    async findOne(userId: string, id: string) {
        const fixedExpense = await this.prisma.fixedExpense.findFirst({
            where: { id, userId },
            include: {
                category: true,
                account: true,
            },
        });

        if (!fixedExpense) {
            throw new NotFoundException("Fixed expense not found");
        }

        return fixedExpense;
    }

    async update(userId: string, id: string, dto: UpdateFixedExpenseDto) {
        // Verify ownership
        await this.findOne(userId, id);

        return this.prisma.fixedExpense.update({
            where: { id },
            data: dto,
        });
    }

    async remove(userId: string, id: string) {
        // Verify ownership
        await this.findOne(userId, id);

        return this.prisma.fixedExpense.delete({
            where: { id },
        });
    }
}
