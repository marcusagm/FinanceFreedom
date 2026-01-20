import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { PrismaModule } from "../../prisma/prisma.module";
import { CurrencyModule } from "../currency/currency.module";

import { CreditCardModule } from "../credit-card/credit-card.module";

@Module({
    imports: [PrismaModule, CurrencyModule, CreditCardModule],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule {}
