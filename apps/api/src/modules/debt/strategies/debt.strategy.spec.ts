import { Debt } from "@prisma/client";
import { describe, it, expect } from "vitest";
import { SnowballStrategy } from "./snowball.strategy";
import { AvalancheStrategy } from "./avalanche.strategy";

const mockDebts: Debt[] = [
    {
        id: "1",
        name: "Debt A",
        totalAmount: 1000,
        interestRate: 10,
        minimumPayment: 100,
        dueDate: 1,
        categoryId: null,
        priority: 1,
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        name: "Debt B",
        totalAmount: 500,
        interestRate: 2,
        minimumPayment: 50,
        dueDate: 5,
        categoryId: null,
        priority: 2,
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "3",
        name: "Debt C",
        totalAmount: 2000,
        interestRate: 5,
        minimumPayment: 200,
        dueDate: 10,
        categoryId: null,
        priority: 3,
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
] as any; // Cast to avoid strict prisma type issues in mock

describe("Debt Strategies", () => {
    describe("SnowballStrategy", () => {
        it("should sort debts by totalAmount ASC", () => {
            const strategy = new SnowballStrategy();
            const sorted = strategy.sort(mockDebts);

            expect(Number(sorted[0].totalAmount)).toBe(500); // Debt B
            expect(Number(sorted[1].totalAmount)).toBe(1000); // Debt A
            expect(Number(sorted[2].totalAmount)).toBe(2000); // Debt C
        });
    });

    describe("AvalancheStrategy", () => {
        it("should sort debts by interestRate DESC", () => {
            const strategy = new AvalancheStrategy();
            const sorted = strategy.sort(mockDebts);

            expect(Number(sorted[0].interestRate)).toBe(10); // Debt A
            expect(Number(sorted[1].interestRate)).toBe(5); // Debt C
            expect(Number(sorted[2].interestRate)).toBe(2); // Debt B
        });
    });
});
