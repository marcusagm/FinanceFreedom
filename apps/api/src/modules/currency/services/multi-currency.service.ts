import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AwesomeApiProvider } from "../providers/awesome-api.provider";
import { startOfDay } from "date-fns";

@Injectable()
export class MultiCurrencyService {
    private readonly logger = new Logger(MultiCurrencyService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly provider: AwesomeApiProvider,
    ) {}

    async convert(
        amount: number,
        from: string,
        to: string,
        date?: Date,
    ): Promise<number> {
        if (from === to) return amount;
        const rate = await this.getExchangeRate(from, to, date || new Date());
        return amount * rate;
    }

    async getExchangeRate(
        from: string,
        to: string,
        date: Date,
    ): Promise<number> {
        if (from === to) return 1;

        const dateKey = startOfDay(date);

        // Try Cache
        const cached = await this.prisma.exchangeRateCache.findUnique({
            where: {
                from_to_date: {
                    from,
                    to,
                    date: dateKey,
                },
            },
        });

        if (cached) {
            return Number(cached.rate);
        }

        // Fetch
        try {
            const rate = await this.provider.getRate(from, to, dateKey);

            // Save Cache
            await this.prisma.exchangeRateCache.create({
                data: {
                    from,
                    to,
                    date: dateKey,
                    rate: rate,
                },
            });

            return rate;
        } catch (error) {
            this.logger.error(
                `Failed to get exchange rate ${from}->${to}`,
                error,
            );
            throw error;
        }
    }
}
