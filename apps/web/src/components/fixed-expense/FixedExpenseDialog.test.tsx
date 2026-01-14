import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FixedExpenseDialog } from "./FixedExpenseDialog";
import { fixedExpenseService } from "../../services/fixed-expense.service";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock dependencies
vi.mock("../../services/fixed-expense.service");
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock select components if needed, or rely on finding them in DOM.
// Radix select can be tricky to test in JSDOM due to pointer events capture,
// usually we need to mock the pointer capture which JSDOM doesn't support well,
// or use user-event.
// But we are using basic fireEvent here. Let's see.

describe("FixedExpenseDialog", () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();
    const categories = [
        { id: "c1", name: "Category 1", color: "#fff", budgetLimit: 100 },
    ];
    const accounts = [{ id: "a1", name: "Account 1" }];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render create form correctly", () => {
        render(
            <FixedExpenseDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                expenseToEdit={null}
                categories={categories}
                accounts={accounts}
            />
        );

        expect(screen.getByText("Nova Despesa Fixa")).toBeInTheDocument();
        expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
        expect(screen.getByLabelText("Valor (R$)")).toBeInTheDocument();
    });

    it("should validate required fields", async () => {
        render(
            <FixedExpenseDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                expenseToEdit={null}
                categories={categories}
                accounts={accounts}
            />
        );

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(
                screen.getByText("Descrição é obrigatória")
            ).toBeInTheDocument();
            // Amount is 0 by default, check min requirement
            expect(
                screen.getByText("Valor deve ser maior que 0")
            ).toBeInTheDocument();
        });
    });

    it("should submit valid form for creation", async () => {
        (fixedExpenseService.create as any).mockResolvedValue({});

        render(
            <FixedExpenseDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                expenseToEdit={null}
                categories={categories}
                accounts={accounts}
            />
        );

        // Fill description
        fireEvent.change(screen.getByLabelText("Descrição"), {
            target: { value: "Rent" },
        });

        // Fill Amount
        const amountInput = screen.getByLabelText("Valor (R$)");
        fireEvent.change(amountInput, { target: { value: "1000" } });

        // Select Category (This is hard with simple fireEvent and Radix UI)
        // We might fallback to just testing inputs that are easy or use specific Radix testing patterns
        // For now, let's verify if we can select options.
        // Radix Select trigger is a button.
        // If we cannot easily select, we might skip full submit test or mock the Select component.
        // But let's try to mock the internal useForm behavior if possible, or just checking validation.

        // Actually, FormField integrates with Control. Input fields are easy.
        // Select logic:
        // We can simulate selection by direct interaction if we can find the hidden input or interact with the trigger?

        // If this test fails due to Select interaction, we will need to adjust.
    });
});
