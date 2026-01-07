import { Debt } from "@prisma/client";
import { DebtStrategy } from "./debt-strategy.interface";

export class AvalancheStrategy implements DebtStrategy {
    sort(debts: Debt[]): Debt[] {
        return [...debts].sort(
            (a, b) => Number(b.interestRate) - Number(a.interestRate)
        );
    }
}
