import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DebtForm } from "./DebtForm";
import { api } from "../../lib/api";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock API
vi.mock("../../lib/api", () => ({
    api: {
        post: vi.fn(),
        patch: vi.fn(),
    },
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
            />
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
            />
        );

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
            />
        );

        // Fill Name - Using placeholder or just choosing input
        const nameInput = screen.getByPlaceholderText("Ex: Credit Card");
        await user.type(nameInput, "Test Debt");

        // Fill Total Balance
        const amountInput = screen.getAllByPlaceholderText("$ 0.00")[0];
        fireEvent.change(amountInput, { target: { value: "1000" } });

        // Fill Interest Rate
        const rateInput = screen.getByPlaceholderText("0.00%");
        fireEvent.change(rateInput, { target: { value: "5" } });

        // Fill Minimum Payment
        const minPayInput = screen.getAllByPlaceholderText("$ 0.00")[1];
        fireEvent.change(minPayInput, { target: { value: "100" } });

        // Fill Due Day - Find by value since it has default 10
        const dueDayInput = screen.getByDisplayValue("10");
        fireEvent.change(dueDayInput, { target: { value: "15" } });

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
                    })
                );
            },
            { timeout: 4000 }
        );

        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });
});
