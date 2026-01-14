import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Categories } from "./Categories";
import { categoryService } from "../services/category.service";
import { toast } from "sonner";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock dependencies
vi.mock("../services/category.service");
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("Categories Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch and display categories on load", async () => {
        const categories = [
            { id: "1", name: "Food", color: "#FF0000", budgetLimit: 1000 },
        ];
        (categoryService.getAll as any).mockResolvedValue(categories);

        render(<Categories />);

        expect(screen.getByText("Gestão de Categorias")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Food")).toBeInTheDocument();
        });
    });

    it("should open create dialog when button is clicked", async () => {
        (categoryService.getAll as any).mockResolvedValue([]);
        render(<Categories />);

        await waitFor(() => expect(categoryService.getAll).toHaveBeenCalled());

        fireEvent.click(screen.getByText("Nova Categoria"));

        await waitFor(() => {
            // Radix dialogs might be tricky with roles in some test envs, checking content is safer
            expect(
                screen.getByText("Configure o nome e a cor da sua categoria.")
            ).toBeInTheDocument();
        });
    });

    it("should handle error when fetching categories", async () => {
        (categoryService.getAll as any).mockRejectedValue(new Error("Failed"));
        render(<Categories />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Erro ao carregar categorias"
            );
        });
    });
});
