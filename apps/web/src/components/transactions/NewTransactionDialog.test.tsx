/**
 * @vitest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom/vitest";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { NewTransactionDialog } from "./NewTransactionDialog";

afterEach(() => {
    cleanup();
});
import { api } from "../../lib/api";

// Mock api
vi.mock("../../lib/api", () => ({
    api: {
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

// Mock DatePicker to avoid date-fns dependency issues in test environment
vi.mock("../ui/DatePicker", () => ({
    DatePicker: ({ date, setDate, placeholder }: any) => (
        <input
            data-testid="date-picker"
            placeholder={placeholder}
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) =>
                setDate(
                    e.target.value
                        ? new Date(e.target.value + "T00:00:00")
                        : undefined
                )
            }
        />
    ),
}));

describe("NewTransactionDialog", () => {
    const mockAccounts = [{ id: "acc1", name: "Wallet" }];
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
        accounts: mockAccounts,
    };

    it("renders form fields", () => {
        render(<NewTransactionDialog {...mockProps} />);
        expect(screen.getByText("Nova Transação")).toBeInTheDocument();
        // Use placeholders which are explicit in the component
        expect(
            screen.getByPlaceholderText("Ex: Mercado, Salário")
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText("R$ 0,00")).toBeInTheDocument();
    });

    it("submits new transaction", async () => {
        render(<NewTransactionDialog {...mockProps} />);

        // Fill Description
        const descInput = screen.getByPlaceholderText("Ex: Mercado, Salário");
        fireEvent.change(descInput, { target: { value: "Test Tx" } });

        // Fill Amount
        const amountInput = screen.getByPlaceholderText("R$ 0,00");
        fireEvent.change(amountInput, { target: { value: "100" } });

        // Fill Date (using mock)
        const dateInput = screen.getByPlaceholderText("Selecione a data");
        fireEvent.change(dateInput, { target: { value: "2023-10-25" } });

        // Submit
        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
        });
        expect(mockProps.onSuccess).toHaveBeenCalled();
    });

    it("renders edit mode", () => {
        const tx = {
            id: "1",
            description: "Old Tx",
            amount: 50,
            type: "EXPENSE",
            date: "2023-01-01",
            accountId: "acc1",
            category: "Food",
        };
        render(<NewTransactionDialog {...mockProps} initialData={tx} />);
        expect(screen.getByText("Editar Transação")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Old Tx")).toBeInTheDocument();
    });
});
