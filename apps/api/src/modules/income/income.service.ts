import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateIncomeSourceDto } from "./dto/create-income-source.dto";
import { CreateWorkUnitDto } from "./dto/create-work-unit.dto";

@Injectable()
export class IncomeService {
    constructor(private readonly prisma: PrismaService) {}

    async createIncomeSource(data: CreateIncomeSourceDto) {
        return this.prisma.incomeSource.create({
            data,
        });
    }

    async findAllIncomeSources() {
        return this.prisma.incomeSource.findMany();
    }

    async updateIncomeSource(id: string, data: Partial<CreateIncomeSourceDto>) {
        return this.prisma.incomeSource.update({
            where: { id },
            data,
        });
    }

    async deleteIncomeSource(id: string) {
        return this.prisma.incomeSource.delete({
            where: { id },
        });
    }

    async createWorkUnit(data: CreateWorkUnitDto) {
        return this.prisma.workUnit.create({
            data,
        });
    }

    async findAllWorkUnits() {
        return this.prisma.workUnit.findMany();
    }

    async updateWorkUnit(id: string, data: Partial<CreateWorkUnitDto>) {
        return this.prisma.workUnit.update({
            where: { id },
            data,
        });
    }

    async deleteWorkUnit(id: string) {
        return this.prisma.workUnit.delete({
            where: { id },
        });
    }
}
