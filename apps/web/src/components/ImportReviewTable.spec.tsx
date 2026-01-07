import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ImportReviewTable } from "./ImportReviewTable";
import { ImportedTransaction } from "../services/import.service";

const mockTransactions: ImportedTransaction[] = [
    {
        date: new Date("2023-01-01"),
        amount: -50.0,
        description: "Test Grocery",
        type: "EXPENSE",
        accountId: "acc1",
        fitId: "1",
    },
    {
        date: new Date("2023-01-02"),
        amount: 100.0,
        description: "Salary",
        type: "INCOME",
        accountId: "acc1",
        fitId: "2",
    },
];

describe("ImportReviewTable", () => {
    it("renders table with transactions", () => {
        render(<ImportReviewTable transactions={mockTransactions} />);

        expect(screen.getByText("Test Grocery")).toBeInTheDocument();
        expect(screen.getByText("Salary")).toBeInTheDocument();
        expect(screen.getByText("-R$ 50,00")).toBeInTheDocument();
        expect(screen.getByText("R$ 100,00")).toBeInTheDocument();
    });

    it("renders empty state if no transactions", () => {
        render(<ImportReviewTable transactions={[]} />);
        // It might render headers still, checking if rows are absent
        expect(screen.queryByText("Test Grocery")).not.toBeInTheDocument();
    });
});
