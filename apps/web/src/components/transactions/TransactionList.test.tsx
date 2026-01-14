import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../utils/test-utils";
import { TransactionList } from "./TransactionList";

// Mock TimeCostBadge and hooks
vi.mock("../simulators/TimeCostBadge", () => ({
    TimeCostBadge: () => <span data-testid="time-cost-badge">TimeCost</span>,
}));

vi.mock("../../hooks/useHourlyRate", () => ({
    useHourlyRate: () => ({ hourlyRate: 50 }),
}));

describe("TransactionList", () => {
    const mockTransaction = {
        id: "1",
        description: "Grocery",
        amount: 50.0, // float
        type: "EXPENSE" as "EXPENSE" | "INCOME",
        date: new Date("2023-01-01").toISOString(),
        accountId: "acc1",
        account: { name: "Wallet" },
        category: "Food",
    };

    const mockProps = {
        transactions: [mockTransaction],
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    };

    it("renders transaction table", () => {
        render(<TransactionList {...mockProps} />);
        expect(screen.getByText("Data")).toBeInTheDocument();
        expect(screen.getByText("Grocery")).toBeInTheDocument();
        expect(screen.getByText("Wallet")).toBeInTheDocument(); // Account name
        expect(screen.getByText("Food")).toBeInTheDocument(); // category
        expect(screen.getByText("TimeCost")).toBeInTheDocument(); // badge for expense
    });

    it("formats income correctly", () => {
        const incomeTx = {
            ...mockTransaction,
            type: "INCOME" as "EXPENSE" | "INCOME",
            amount: 1000,
        };
        render(<TransactionList {...mockProps} transactions={[incomeTx]} />);
        expect(screen.getByText(/\+/)).toBeInTheDocument();
        expect(screen.queryByTestId("time-cost-badge")).not.toBeInTheDocument();
    });

    it("calls onEdit", () => {
        render(<TransactionList {...mockProps} />);
        const editBtn = screen.getByTitle("Editar"); // Button has title prop
        fireEvent.click(editBtn);
        expect(mockProps.onEdit).toHaveBeenCalledWith(mockTransaction);
    });

    it("calls onDelete", () => {
        render(<TransactionList {...mockProps} />);
        const deleteBtn = screen.getByTitle("Excluir");
        fireEvent.click(deleteBtn);
        expect(mockProps.onDelete).toHaveBeenCalledWith("1");
    });

    it("opens split dialog", () => {
        render(<TransactionList {...mockProps} />);
        const splitBtn = screen.getByTitle("Dividir Transação");
        fireEvent.click(splitBtn);
        // Checking if dialog opened by looking for its title
        expect(screen.getByText("Dividir Transação")).toBeInTheDocument();
    });

    it("renders empty state", () => {
        render(<TransactionList {...mockProps} transactions={[]} />);
        expect(screen.getByText("Nenhuma transação encontrada.")).toBeInTheDocument();
    });
});
