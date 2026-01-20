import { Module } from "@nestjs/common";
import { MultiCurrencyService } from "./services/multi-currency.service";
import { AwesomeApiProvider } from "./providers/awesome-api.provider";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [MultiCurrencyService, AwesomeApiProvider],
    exports: [MultiCurrencyService],
})
export class CurrencyModule {}
