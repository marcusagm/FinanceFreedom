import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateIncomeSourceDto } from "./dto/create-income-source.dto";
import { CreateWorkUnitDto } from "./dto/create-work-unit.dto";

@Injectable()
export class IncomeService {
    constructor(private readonly prisma: PrismaService) {}

    async createIncomeSource(userId: string, data: CreateIncomeSourceDto) {
        return this.prisma.incomeSource.create({
            data: { ...data, userId },
        });
    }

    async findAllIncomeSources(userId: string) {
        return this.prisma.incomeSource.findMany({ where: { userId } });
    }

    async updateIncomeSource(
        userId: string,
        id: string,
        data: Partial<CreateIncomeSourceDto>
    ) {
        await this.prisma.incomeSource.findFirstOrThrow({
            where: { id, userId },
        });
        return this.prisma.incomeSource.update({
            where: { id },
            data,
        });
    }

    async deleteIncomeSource(userId: string, id: string) {
        await this.prisma.incomeSource.findFirstOrThrow({
            where: { id, userId },
        });
        return this.prisma.incomeSource.delete({
            where: { id },
        });
    }

    async createWorkUnit(userId: string, data: CreateWorkUnitDto) {
        return this.prisma.workUnit.create({
            data: { ...data, userId },
        });
    }

    async findAllWorkUnits(userId: string) {
        return this.prisma.workUnit.findMany({ where: { userId } });
    }

    async updateWorkUnit(
        userId: string,
        id: string,
        data: Partial<CreateWorkUnitDto>
    ) {
        await this.prisma.workUnit.findFirstOrThrow({ where: { id, userId } });
        return this.prisma.workUnit.update({
            where: { id },
            data,
        });
    }

    async deleteWorkUnit(userId: string, id: string) {
        await this.prisma.workUnit.findFirstOrThrow({ where: { id, userId } });
        return this.prisma.workUnit.delete({
            where: { id },
        });
    }
}
