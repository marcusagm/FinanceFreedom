import { fireEvent, render, screen, waitFor } from "@testing-library/react";
/**
 * @vitest-environment jsdom
 */
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../lib/api";
import { DebtPaymentDialog } from "./DebtPaymentDialog";

// Mock api
vi.mock("../../lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe("DebtPaymentDialog", () => {
    const mockAccounts = [{ id: "acc1", name: "Wallet" }];
    const mockDebt = {
        id: "debt1",
        name: "Credit Card",
        totalAmount: 1000,
        interestRate: 10,
        minimumPayment: 100,
        dueDate: "2023-10-10",
    };

    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
        debt: mockDebt,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock accounts fetch
        (api.get as any).mockResolvedValue({ data: mockAccounts });
    });

    it("fetches accounts on open", async () => {
        render(<DebtPaymentDialog {...mockProps} />);
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/accounts");
        });
    });

    it("submits payment transaction", async () => {
        render(<DebtPaymentDialog {...mockProps} />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalled();
        });

        // Fill Amount
        const amountInput = screen.getAllByTestId("amount-input")[0];
        fireEvent.change(amountInput, { target: { value: "200" } });

        // Account is selected by default (first one) or we select it
        // Since we mock API return with 1 account and implementation selects it by default,
        // we can assume accountId is set.
        // But to be safe let's try to verify or select.
        // The Select component is tricky to interact with in tests sometimes without userEvent,
        // but let's assume default selection works as per my implementation.

        // Submit
        const submitBtn = screen.getAllByText("Confirmar Pagamento")[0];
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                "/transactions",
                expect.objectContaining({
                    amount: 200,
                    description: "Pagamento Dívida: Credit Card",
                    type: "EXPENSE",
                    accountId: "acc1",
                    category: "Pagamento de Dívida",
                }),
            );
        });
        expect(mockProps.onSuccess).toHaveBeenCalled();
        expect(mockProps.onClose).toHaveBeenCalled();
    });
});
