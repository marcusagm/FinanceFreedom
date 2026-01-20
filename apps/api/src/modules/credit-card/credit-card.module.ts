import { Module } from "@nestjs/common";
import { CreditCardService } from "./credit-card.service";
import { CreditCardController } from "./credit-card.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [CreditCardController],
    providers: [CreditCardService],
    exports: [CreditCardService],
})
export class CreditCardModule {}
