import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSavingsGoalDto } from "./dto/create-savings-goal.dto";
import { UpdateSavingsGoalDto } from "./dto/update-savings-goal.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SavingsGoalService {
    constructor(private readonly prisma: PrismaService) {}

    create(userId: string, createSavingsGoalDto: CreateSavingsGoalDto) {
        return this.prisma.savingsGoal.create({
            data: {
                ...createSavingsGoalDto,
                deadline: createSavingsGoalDto.deadline
                    ? new Date(createSavingsGoalDto.deadline)
                    : undefined,
                userId,
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.savingsGoal.findMany({
            where: { userId },
            orderBy: { priority: "asc" }, // Priority sort makes sense here
        });
    }

    async findOne(userId: string, id: string) {
        const goal = await this.prisma.savingsGoal.findFirst({
            where: { id, userId },
        });

        if (!goal) {
            throw new NotFoundException(`Savings Goal with ID ${id} not found`);
        }

        return goal;
    }

    async update(
        userId: string,
        id: string,
        updateSavingsGoalDto: UpdateSavingsGoalDto
    ) {
        await this.findOne(userId, id);

        const { deadline, ...rest } = updateSavingsGoalDto;

        return this.prisma.savingsGoal.update({
            where: { id },
            data: {
                ...rest,
                deadline: deadline ? new Date(deadline) : undefined,
            },
        });
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id);

        return this.prisma.savingsGoal.delete({
            where: { id },
        });
    }
}
