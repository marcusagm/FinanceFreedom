import { render, screen, fireEvent } from "@testing-library/react";
import { FixedExpenseList } from "./FixedExpenseList";
import { vi, describe, it, expect } from "vitest";

describe("FixedExpenseList", () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const expenses = [
        {
            id: "1",
            description: "Rent",
            amount: 1000,
            dueDay: 5,
            autoCreate: true,
            categoryId: "c1",
            accountId: "a1",
            category: {
                id: "c1",
                name: "Housing",
                color: "blue",
                budgetLimit: 2000,
            },
            account: { id: "a1", name: "Bank" },
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
        },
    ];

    it("should render empty state", () => {
        render(
            <FixedExpenseList
                expenses={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        expect(
            screen.getByText(/Nenhuma despesa fixa encontrada/i)
        ).toBeInTheDocument();
    });

    it("should render expenses", () => {
        render(
            <FixedExpenseList
                expenses={expenses}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        expect(screen.getByText("Rent")).toBeInTheDocument();
        expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
        expect(screen.getByText("Housing")).toBeInTheDocument();
    });

    it("should trigger actions", () => {
        render(
            <FixedExpenseList
                expenses={expenses}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]); // Edit
        expect(mockOnEdit).toHaveBeenCalledWith(expenses[0]);

        fireEvent.click(buttons[1]); // Delete
        expect(mockOnDelete).toHaveBeenCalledWith("1");
    });
});
