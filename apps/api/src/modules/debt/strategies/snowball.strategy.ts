import { Debt } from "@prisma/client";
import { DebtStrategy } from "./debt-strategy.interface";

export class SnowballStrategy implements DebtStrategy {
    sort(debts: Debt[]): Debt[] {
        return [...debts].sort(
            (a, b) => Number(a.totalAmount) - Number(b.totalAmount)
        );
    }
}
