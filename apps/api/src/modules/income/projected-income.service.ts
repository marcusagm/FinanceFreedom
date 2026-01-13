import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProjectedIncomeService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        userId: string,
        data: Omit<Prisma.ProjectedIncomeCreateInput, "user">
    ) {
        return this.prisma.projectedIncome.create({
            data: { ...data, user: { connect: { id: userId } } },
            include: {
                workUnit: true,
            },
        });
    }

    async findAll(userId: string, startDate: Date, endDate: Date) {
        return this.prisma.projectedIncome.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                workUnit: true,
                transaction: true,
            },
            orderBy: {
                date: "asc",
            },
        });
    }

    async update(
        userId: string,
        id: string,
        data: Prisma.ProjectedIncomeUpdateInput
    ) {
        // First get current state to check for existing transaction
        const current = await this.prisma.projectedIncome.findFirst({
            where: { id, userId },
        });

        if (!current) {
            throw new Error("Projected Income not found");
        }

        const result = await this.prisma.projectedIncome.update({
            where: { id },
            data,
            include: {
                workUnit: true,
            },
        });

        if (data.status === "PAID") {
            // Only create if we don't have a transaction yet
            if (!current.transactionId) {
                const amount = Number(result.amount);
                const accounts = await this.prisma.account.findMany({
                    where: { userId },
                    take: 1,
                });

                if (accounts.length > 0) {
                    const transaction = await this.prisma.transaction.create({
                        data: {
                            amount: amount,
                            date: result.date,
                            description: `Pagamento: ${result.workUnit.name}`,
                            type: "INCOME",
                            category: "Trabalho",
                            accountId: accounts[0].id,
                            userId,
                        },
                    });

                    // Link the transaction back to the projection
                    await this.prisma.projectedIncome.update({
                        where: { id },
                        data: { transactionId: transaction.id },
                    });
                }
            }
        } else if (data.status && data.status !== "PAID") {
            // If moving away from PAID and we have a transaction, delete it
            if (current.transactionId) {
                await this.prisma.transaction.delete({
                    where: { id: current.transactionId },
                });
                // The SetNull on delete in schema handles the unlinking, but explicit null is fine too
            }
        }

        return result;
    }

    async remove(userId: string, id: string) {
        await this.prisma.projectedIncome.findFirstOrThrow({
            where: { id, userId },
        });
        return this.prisma.projectedIncome.delete({
            where: { id },
        });
    }

    async distribute(
        userId: string,
        data: {
            workUnitId: string;
            startDate: Date;
            hoursPerDay?: number;
            skipWeekends?: boolean;
        }
    ) {
        const workUnit = await this.prisma.workUnit.findFirst({
            where: { id: data.workUnitId, userId },
        });

        if (!workUnit) throw new Error("Work Unit not found");

        const estimatedTime = Number(workUnit.estimatedTime) || 1; // Avoid div by zero
        const defaultPrice = Number(workUnit.defaultPrice);
        const hourlyRate = defaultPrice / estimatedTime;

        const hoursPerDay = data.hoursPerDay || 8;
        const totalHours = estimatedTime;
        const totalDays = Math.ceil(totalHours / hoursPerDay);
        const dailyAmount = hourlyRate * hoursPerDay;

        const createdIds = [];
        let currentDate = new Date(data.startDate);
        let hoursRemaining = totalHours;

        for (let i = 0; i < totalDays && hoursRemaining > 0; i++) {
            // Check weekend
            if (data.skipWeekends) {
                while (
                    currentDate.getDay() === 0 ||
                    currentDate.getDay() === 6
                ) {
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }

            // Calculate actual hours for this day (might be partial last day)
            const hoursToday = Math.min(hoursRemaining, hoursPerDay);
            const amountToday = hourlyRate * hoursToday;

            const created = await this.create(userId, {
                workUnit: { connect: { id: workUnit.id } },
                date: new Date(currentDate),
                amount: amountToday,
                status: "PLANNED",
            });
            createdIds.push(created.id);

            hoursRemaining -= hoursToday;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return createdIds;
    }
}
