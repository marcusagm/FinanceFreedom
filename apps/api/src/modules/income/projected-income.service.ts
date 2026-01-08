import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProjectedIncomeService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.ProjectedIncomeCreateInput) {
        return this.prisma.projectedIncome.create({
            data,
            include: {
                workUnit: true,
            },
        });
    }

    async findAll(startDate: Date, endDate: Date) {
        return this.prisma.projectedIncome.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                workUnit: true,
            },
            orderBy: {
                date: "asc",
            },
        });
    }

    async update(id: string, data: Prisma.ProjectedIncomeUpdateInput) {
        return this.prisma.projectedIncome.update({
            where: { id },
            data,
            include: {
                workUnit: true,
            },
        });
    }

    async remove(id: string) {
        return this.prisma.projectedIncome.delete({
            where: { id },
        });
    }
}
