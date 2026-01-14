import { Module } from "@nestjs/common";
import { FixedExpenseService } from "./fixed-expense.service";
import { FixedExpenseController } from "./fixed-expense.controller";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
    controllers: [FixedExpenseController],
    providers: [FixedExpenseService, PrismaService],
    exports: [FixedExpenseService],
})
export class FixedExpenseModule {}
