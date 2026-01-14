import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateInvestmentAccountDto } from "./dto/create-investment-account.dto";
import { UpdateInvestmentAccountDto } from "./dto/update-investment-account.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class InvestmentAccountService {
    constructor(private readonly prisma: PrismaService) {}

    create(
        userId: string,
        createInvestmentAccountDto: CreateInvestmentAccountDto
    ) {
        return this.prisma.investmentAccount.create({
            data: {
                ...createInvestmentAccountDto,
                userId,
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.investmentAccount.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findOne(userId: string, id: string) {
        const account = await this.prisma.investmentAccount.findFirst({
            where: { id, userId },
        });

        if (!account) {
            throw new NotFoundException(
                `Investment Account with ID ${id} not found`
            );
        }

        return account;
    }

    async update(
        userId: string,
        id: string,
        updateInvestmentAccountDto: UpdateInvestmentAccountDto
    ) {
        await this.findOne(userId, id); // Ensure exists/owned

        return this.prisma.investmentAccount.update({
            where: { id },
            data: updateInvestmentAccountDto,
        });
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id); // Ensure exists/owned

        return this.prisma.investmentAccount.delete({
            where: { id },
        });
    }
}
