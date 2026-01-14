import { PrivacyProvider } from "@/contexts/PrivacyContext";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
/**
 * @vitest-environment jsdom
 */
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../lib/api";
import { StrategyComparison } from "./StrategyComparison";

// Mock api
vi.mock("../../lib/api", () => ({
    api: {
        get: vi.fn(),
    },
}));

// Mock DebtPaymentDialog to avoid testing it inside StrategyComparison
vi.mock("./DebtPaymentDialog", () => ({
    DebtPaymentDialog: ({ isOpen, onClose, onSuccess, debt }: any) =>
        isOpen ? (
            <div data-testid="payment-dialog">
                <p>Payment Dialog for {debt.name}</p>
                <button onClick={onClose}>Close</button>
                <button onClick={onSuccess}>Success</button>
            </div>
        ) : null,
}));

describe("StrategyComparison", () => {
    const mockDebts = [
        {
            id: "d1",
            name: "Debt 1",
            totalAmount: 500,
            interestRate: 2,
            minimumPayment: 50,
            dueDate: "2023-10-10",
        },
        {
            id: "d2",
            name: "Debt 2", // Should be focus
            totalAmount: 100,
            interestRate: 10,
            minimumPayment: 10,
            dueDate: "2023-10-10",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        // Default to returning empty or specific debts
        (api.get as any).mockResolvedValue({
            data: {
                debts: [],
                projection: { monthsToPayoff: 0, totalInterest: 0 },
            },
        });

        // Clear localStorage
        localStorage.clear();
    });

    it("renders and loads snowball strategy by default", async () => {
        render(
            <PrivacyProvider>
                <StrategyComparison />
            </PrivacyProvider>,
        );
        expect(screen.getByText("❄️ Bola de Neve (Psicológico)")).toBeInTheDocument();
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/debts/strategy?type=SNOWBALL&monthlyExtra=0");
        });
    });

    it("persists monthly extra value in localStorage", async () => {
        render(
            <PrivacyProvider>
                <StrategyComparison />
            </PrivacyProvider>,
        );

        const input = screen.getByLabelText("Valor Extra Mensal (Opcional)");
        fireEvent.change(input, { target: { value: "500" } });

        await waitFor(() => {
            expect(localStorage.getItem("debt_strategy_extra_value")).toBe("500");
        });
    });

    it("loads monthly extra value from localStorage", async () => {
        localStorage.setItem("debt_strategy_extra_value", "300");
        render(
            <PrivacyProvider>
                <StrategyComparison />
            </PrivacyProvider>,
        );

        const input = screen.getByLabelText("Valor Extra Mensal (Opcional)") as HTMLInputElement;
        expect(input.value).toBe("R$ 300,00"); // Currency input formatting
    });

    it("shows payment button for the first debt (Focus Debt)", async () => {
        (api.get as any).mockResolvedValue({
            data: {
                debts: mockDebts,
                projection: { monthsToPayoff: 10, totalInterest: 500 },
            },
        });
        render(
            <PrivacyProvider>
                <StrategyComparison />
            </PrivacyProvider>,
        );

        await waitFor(() => {
            expect(screen.getByText("Debt 1")).toBeInTheDocument();
        });

        // The first debt in the list (mockDebts[0]) is the one rendered first.
        // In the real app, the API returns them sorted.
        // Here, "Debt 1" is index 0.

        // Find "Registrar Pagamento" button
        const buttons = screen.getAllByText("Registrar Pagamento");
        // Should only be one
        expect(buttons).toHaveLength(1);

        // Click it
        fireEvent.click(buttons[0]);

        // Expect Dialog to open
        expect(screen.getByTestId("payment-dialog")).toBeInTheDocument();
        expect(screen.getByText("Payment Dialog for Debt 1")).toBeInTheDocument();
    });
});
