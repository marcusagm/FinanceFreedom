import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DebtForm } from "./DebtForm";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock API
const mockPost = vi.fn();
const mockPatch = vi.fn();
vi.mock("../../lib/api", () => ({
    api: {
        post: (...args: any[]) => mockPost(...args),
        patch: (...args: any[]) => mockPatch(...args),
    },
}));

describe("DebtForm", () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render create form correctly", () => {
        render(
            <DebtForm
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.getByText("Nova Dívida")).toBeInTheDocument();
        expect(screen.getByLabelText("Nome da Dívida")).toBeInTheDocument();
        expect(screen.getByText("Salvar")).toBeInTheDocument();
    });

    it("should validate required fields", async () => {
        const user = userEvent.setup();
        render(
            <DebtForm
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        const submitButton = screen.getByRole("button", { name: "Salvar" });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
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

        // Fill Name
        await user.type(screen.getByLabelText("Nome da Dívida"), "Test Debt");

        // Fill Amounts - Using getAllByRole generic or placeholder to avoid label issues with currency input wrappers
        await user.type(screen.getByLabelText("Saldo Devedor"), "1000");
        await user.type(screen.getByLabelText("Juros Mensal (%)"), "5");
        await user.type(screen.getByLabelText("Pagamento Mínimo"), "100");
        await user.type(screen.getByLabelText("Dia Vencimento"), "10");

        const submitButton = screen.getByRole("button", { name: "Salvar" });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(
                "/debts",
                expect.objectContaining({
                    name: "Test Debt",
                    totalAmount: 1000,
                    interestRate: 5,
                    minimumPayment: 100,
                    dueDate: 10,
                })
            );
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it("should populate form when editing", () => {
        const debtToEdit = {
            id: "1",
            name: "Existing Debt",
            totalAmount: 5000,
            interestRate: 2.5,
            minimumPayment: 300,
            dueDate: 15,
        };

        render(
            <DebtForm
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                debtToEdit={debtToEdit}
            />
        );

        expect(screen.getByText("Editar Dívida")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Existing Debt")).toBeInTheDocument();
        expect(screen.getByDisplayValue("R$ 5.000,00")).toBeInTheDocument(); // Currency Input format check might be tricky
    });
});
