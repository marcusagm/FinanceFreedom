import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { categoryService } from "../../services/category.service";
import { CategoryDialog } from "./CategoryDialog";

// Mock dependencies
vi.mock("../../services/category.service");
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("CategoryDialog", () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render create form correctly", async () => {
        render(
            <CategoryDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                categoryToEdit={null}
            />,
        );

        expect(screen.getByText(/Nova Categoria/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Ex: Alimentação/i)).toBeInTheDocument();
        // Color input text field
        expect(screen.getByDisplayValue("#3B82F6")).toBeInTheDocument();
        // Budget limit
        await waitFor(() => {
            const inputs = screen.getAllByRole("textbox");
            expect(inputs.length).toBeGreaterThanOrEqual(2); // Name, Color hex, Budget
        });
    });

    it("should render edit form correctly", () => {
        const category = {
            id: "1",
            name: "Food",
            color: "#FF0000",
            budgetLimit: 1000,
        };
        render(
            <CategoryDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                categoryToEdit={category}
            />,
        );

        expect(screen.getByText("Editar Categoria")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Food")).toBeInTheDocument();
        expect(screen.getByDisplayValue(/1.000,00/)).toBeInTheDocument(); // Currency format
    });

    it("should show validation errors", async () => {
        render(
            <CategoryDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                categoryToEdit={null}
            />,
        );

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
        });
    });

    it("should call create service on submit", async () => {
        (categoryService.create as any).mockResolvedValue({});
        render(
            <CategoryDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                categoryToEdit={null}
            />,
        );

        fireEvent.change(screen.getByPlaceholderText("Ex: Alimentação"), {
            target: { value: "Transport" },
        });
        // Simulating color change might be tricky depending on ColorInput implementation,
        // usually it's an input type='color' or a custom component.
        // Assuming default color is fine.

        // Handling currency input
        const budgetInput = screen.getByPlaceholderText("0,00");
        fireEvent.change(budgetInput, { target: { value: "500" } });

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(categoryService.create).toHaveBeenCalledWith({
                name: "Transport",
                color: "#3B82F6", // Default value
                budgetLimit: 500,
            });
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith("Categoria criada!");
        });
    });

    it("should call update service on submit", async () => {
        const category = {
            id: "1",
            name: "Food",
            color: "#FF0000",
            budgetLimit: 1000,
        };
        (categoryService.update as any).mockResolvedValue({});

        render(
            <CategoryDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                categoryToEdit={category}
            />,
        );

        fireEvent.change(screen.getByPlaceholderText("Ex: Alimentação"), {
            target: { value: "Food Updated" },
        });

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(categoryService.update).toHaveBeenCalledWith(
                "1",
                expect.objectContaining({
                    name: "Food Updated",
                    budgetLimit: 1000,
                }),
            );
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith("Categoria atualizada!");
        });
    });
});
