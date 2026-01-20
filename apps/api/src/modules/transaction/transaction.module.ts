import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { PrismaModule } from "../../prisma/prisma.module";
import { CurrencyModule } from "../currency/currency.module";

@Module({
    imports: [PrismaModule, CurrencyModule],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule {}
