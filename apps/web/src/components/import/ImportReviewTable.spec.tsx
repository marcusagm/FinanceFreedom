import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "../../utils/test-utils";
import { ImportReviewTable } from "./ImportReviewTable";
import "@testing-library/jest-dom";
import type { ImportedTransaction } from "../../services/import.service";

const mockTransactions: ImportedTransaction[] = [
    {
        date: new Date("2023-01-01").toISOString(),
        amount: -50.0,
        description: "Test Grocery",
        type: "EXPENSE",
        accountId: "acc1",
        category: "Food",
    },
    {
        date: new Date("2023-01-02").toISOString(),
        amount: 100.0,
        description: "Salary",
        type: "INCOME",
        accountId: "acc1",
        category: "Salary",
    },
];

describe("ImportReviewTable", () => {
    it("renders table with transactions", () => {
        render(
            <ImportReviewTable
                transactions={mockTransactions}
                accounts={[{ id: "acc1", name: "Test Account" }]}
            />,
        );

        expect(screen.getByText("Test Grocery")).toBeInTheDocument();
        expect(screen.getAllByText("Salary")).toHaveLength(2);
        expect(screen.getByText(/50,00/)).toBeInTheDocument();
        expect(screen.getByText(/100,00/)).toBeInTheDocument();
    });

    it("renders empty state if no transactions", () => {
        render(<ImportReviewTable transactions={[]} accounts={[]} />);
        // It might render headers still, checking if rows are absent
        expect(screen.queryByText("Test Grocery")).not.toBeInTheDocument();
    });
});
