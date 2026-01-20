import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../lib/api";
import { DebtForm } from "./DebtForm";

// Mock API
vi.mock("../../lib/api", () => ({
    api: {
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

// Mock sonner
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock Translations
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                "debts.form.titleNew": "New Debt",
                "debts.form.titleEdit": "Edit Debt",
                "debts.form.subtitle": "Debt Details",
                "debts.form.nameLabel": "Debt Name",
                "debts.form.namePlaceholder": "Ex: Credit Card",
                "debts.form.validation.nameRequired": "Name is required",
                "debts.form.validation.amountNumber": "Amount must be a number",
                "common.currencyPlaceholder": "$ 0.00",
                "debts.form.interestLabel": "Interest Rate",
                "common.percentPlaceholder": "0.00%",
                "debts.form.minPaymentLabel": "Minimum Payment",
                "debts.form.dueDayLabel": "Due Day",
                "debts.form.installmentsTotalLabel": "Total Installments",
                "debts.form.installmentsPaidLabel": "Paid Installments",
                "debts.form.firstDateLabel": "First Installment Date",
                "common.cancel": "Cancel",
                "common.save": "Save",
                "common.saving": "Saving...",
                "debts.form.totalLabel": "Total Balance",
            };
            return translations[key] || key;
        },
    }),
}));

describe("DebtForm", () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();
    const mockPost = api.post as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders new debt form", () => {
        render(
            <DebtForm
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />,
        );
        expect(screen.getByText("New Debt")).toBeInTheDocument();
        expect(screen.getByText("Debt Name")).toBeInTheDocument();
    });

    it("shows validation error for empty name", async () => {
        const user = userEvent.setup();
        render(
            <DebtForm
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />,
        );

        // Log screen to debug if needed, but first ensure we wait for interaction
        const submitBtn = screen.getByRole("button", { name: /save/i });
        await user.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText("Name is required")).toBeInTheDocument();
        });
    });

    it("should submit new debt successfully", async () => {
        const user = userEvent.setup();
        mockPost.mockResolvedValueOnce({ data: {} });

        render(
            <DebtForm
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />,
        );

        // Fill Name
        const nameInput = screen.getByPlaceholderText("Ex: Credit Card");
        await user.type(nameInput, "Test Debt");

        // Fill Total Balance - Use user.type for NumericFormat
        const amountInput = screen.getAllByPlaceholderText("$ 0.00")[0];
        await user.click(amountInput);
        await user.keyboard("1000");

        // Fill Interest Rate
        const rateInput = screen.getByPlaceholderText("0.00%");
        await user.type(rateInput, "5");

        // Fill Minimum Payment
        const minPayInput = screen.getAllByPlaceholderText("$ 0.00")[1];
        await user.click(minPayInput);
        await user.keyboard("100");

        // Fill Due Day
        const dueDayInput = screen.getByDisplayValue("10");
        await user.clear(dueDayInput);
        await user.type(dueDayInput, "15");

        const submitBtn = screen.getByRole("button", { name: /save/i });
        await user.click(submitBtn);

        await waitFor(
            () => {
                expect(mockPost).toHaveBeenCalledWith(
                    "/debts",
                    expect.objectContaining({
                        name: "Test Debt",
                        totalAmount: 1000,
                        interestRate: 5,
                        minimumPayment: 100,
                        dueDate: 15,
                    }),
                );
            },
            { timeout: 5000 },
        );

        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });
});
