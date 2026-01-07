import { Debt } from "@prisma/client";

export interface DebtStrategy {
    sort(debts: Debt[]): Debt[];
}
