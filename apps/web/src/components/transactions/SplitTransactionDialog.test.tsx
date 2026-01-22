/**
 * @vitest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom/vitest";
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../lib/api";
import { SplitTransactionDialog } from "./SplitTransactionDialog";

afterEach(() => {
    cleanup();
});

// Mock api
vi.mock("../../lib/api", () => ({
    api: {
        post: vi.fn(),
    },
}));

// Mock Input to avoid formatting issues
vi.mock("../ui/Input", () => ({
    Input: React.forwardRef(
        ({ onValueChange, currency, ...props }: any, ref: any) => (
            <input
                ref={ref}
                {...props}
                onChange={(e) => {
                    props.onChange?.(e);
                    onValueChange?.({ floatValue: Number(e.target.value) });
                }}
            />
        ),
    ),
}));

// Mock CategorySelect
vi.mock("../category/CategorySelect", () => ({
    CategorySelect: (props: any) => (
        <select data-testid="category-select" {...props} />
    ),
}));

// Mock Lucide icons for reliable finding
vi.mock("lucide-react", () => ({
    Plus: () => <span data-testid="plus-icon" />,
    Trash2: () => <span data-testid="trash-icon" />,
    X: () => <span data-testid="close-icon" />,
}));

// Mock sonner toast
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock translations
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const map: Record<string, string> = {
                "transactions.split.title": "Dividir Transação",
                "transactions.split.remaining": "Restante para alocar",
                "transactions.split.addSplit": "Adicionar Divisão",
                "transactions.split.confirm": "Confirmar Divisão",
                "transactions.table.amount": "Valor",
                "transactions.table.description": "Descr.",
                "transactions.table.category": "Categoria",
                "common.description": "Descr.",
            };
            return map[key] || key;
        },
    }),
}));

describe("SplitTransactionDialog", () => {
    const mockTransaction = {
        id: "tx-1",
        description: "Original Tx",
        amount: 100,
        type: "EXPENSE",
        date: "2023-01-01",
        accountId: "acc-1",
        category: "General",
        account: { name: "Wallet", id: "acc-1" },
    };

    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
        transaction: mockTransaction,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders correctly with initial splits", () => {
        render(<SplitTransactionDialog {...mockProps} />);
        expect(screen.getByText("Dividir Transação")).toBeInTheDocument();
        expect(screen.getByText("Restante para alocar:")).toBeInTheDocument();

        // Should have 2 splits by default
        const descriptionInputs = screen.getAllByPlaceholderText("Descr.");
        expect(descriptionInputs).toHaveLength(2);

        // Initial values: 100 split into 50 and 50
        const amountInputs = screen.getAllByPlaceholderText(
            "0.00",
        ) as HTMLInputElement[];
        expect(amountInputs[0].value).toBe("50");
        expect(amountInputs[1].value).toBe("50");
    });

    it("adds and removes split rows", async () => {
        render(<SplitTransactionDialog {...mockProps} />);

        // Add split
        fireEvent.click(screen.getByText("Adicionar Divisão"));
        expect(screen.getAllByPlaceholderText("Descr.")).toHaveLength(3);

        // Remove split (last one)
        // Find all trash icons
        const trashIcons = screen.getAllByTestId("trash-icon");
        // Each icon is inside a button. Click the last icon.
        fireEvent.click(trashIcons[trashIcons.length - 1]);

        expect(screen.getAllByPlaceholderText("Descr.")).toHaveLength(2);
    });

    it("validates total amount equal to original", async () => {
        render(<SplitTransactionDialog {...mockProps} />);

        // Change first amount to 60 -> Total 110 (60 + 50)
        const amountInputs = screen.getAllByPlaceholderText("0.00");
        fireEvent.change(amountInputs[0], { target: { value: "60" } });

        fireEvent.click(screen.getByText("Confirmar Divisão"));

        // Button should be disabled strictly speaking if I implemented that logic?
        // Component code: disabled={form.formState.isSubmitting || Math.abs(remaining) > 0.01}
        // So button IS disabled.

        expect(screen.getByText("Confirmar Divisão")).toBeDisabled();
    });

    it("submits valid split", async () => {
        render(<SplitTransactionDialog {...mockProps} />);

        // Default is 50/50 which is valid for 100 total.
        // Just fill descriptions
        const descInputs = screen.getAllByPlaceholderText("Descr.");
        fireEvent.change(descInputs[0], { target: { value: "Part 1" } });
        fireEvent.change(descInputs[1], { target: { value: "Part 2" } });

        const submitBtn = screen.getByText("Confirmar Divisão");
        expect(submitBtn).not.toBeDisabled();

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                "/transactions/tx-1/split",
                expect.objectContaining({
                    splits: expect.arrayContaining([
                        expect.objectContaining({
                            amount: 50,
                            description: "Part 1",
                        }),
                        expect.objectContaining({
                            amount: 50,
                            description: "Part 2",
                        }),
                    ]),
                }),
            );
        });

        expect(toast.success).toHaveBeenCalled();
        expect(mockProps.onSuccess).toHaveBeenCalled();
    });
});
