import { Injectable, Logger } from "@nestjs/common";
import { CurrencyProvider } from "../interfaces/currency-provider.interface";
import { format } from "date-fns";

@Injectable()
export class AwesomeApiProvider implements CurrencyProvider {
    private readonly logger = new Logger(AwesomeApiProvider.name);
    private readonly baseUrl = "https://economia.awesomeapi.com.br";

    async getRate(from: string, to: string, date?: Date): Promise<number> {
        if (from === to) return 1;

        try {
            let url: string;
            // Only use historical if date is not today/future.
            // Warning: AwesomeApi historical limits.
            // For simplicity, if date provided, try daily/historical.

            const isToday =
                !date ||
                format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            if (!isToday && date) {
                const dateStr = format(date, "yyyyMMdd");
                // Endpoint: https://economia.awesomeapi.com.br/json/daily/{moeda}/?start_date=...&end_date=...
                // Note: 'moeda' parameter logic. USD-BRL.
                url = `${this.baseUrl}/json/daily/${from}-${to}?start_date=${dateStr}&end_date=${dateStr}`;
            } else {
                url = `${this.baseUrl}/last/${from}-${to}`;
            }

            this.logger.debug(`Fetching rate from ${url}`);
            const response = await fetch(url);

            if (!response.ok) {
                this.logger.error(
                    `AwesomeApi failed: ${response.status} ${response.statusText}`,
                );
                throw new Error("Failed to fetch rate");
            }

            const data = await response.json();
            let rateStr: string;

            if (Array.isArray(data)) {
                if (data.length === 0)
                    throw new Error("No rate found for date");
                rateStr = data[0].bid;
            } else {
                // /last/ endpoint returns object keyed by combo
                const key = `${from}${to}`;
                if (data[key]) {
                    rateStr = data[key].bid;
                } else {
                    // Fallback to first key
                    const keys = Object.keys(data);
                    if (keys.length > 0) rateStr = data[keys[0]].bid;
                    else throw new Error("Invalid response format");
                }
            }

            return parseFloat(rateStr);
        } catch (error) {
            this.logger.error(
                `Error in AwesomeApiProvider for ${from}->${to}`,
                error,
            );
            throw error;
        }
    }
}
