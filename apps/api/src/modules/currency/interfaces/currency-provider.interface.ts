export interface CurrencyProvider {
    getRate(from: string, to: string, date?: Date): Promise<number>;
}
