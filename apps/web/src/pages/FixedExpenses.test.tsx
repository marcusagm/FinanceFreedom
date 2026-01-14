import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../lib/api";
import { categoryService } from "../services/category.service";
import { fixedExpenseService } from "../services/fixed-expense.service";
import { FixedExpenses } from "./FixedExpenses";

vi.mock("../services/fixed-expense.service");
vi.mock("../services/category.service");
vi.mock("../lib/api");
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("FixedExpenses Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch and display data", async () => {
        (fixedExpenseService.getAll as any).mockResolvedValue([
            {
                id: "1",
                description: "Rent",
                amount: 1000,
                dueDay: 5,
                autoCreate: true,
                category: { name: "Housing" },
                account: { name: "Bank" },
            },
        ]);
        (categoryService.getAll as any).mockResolvedValue([]);
        (api.get as any).mockResolvedValue({ data: [] });

        render(<FixedExpenses />);

        expect(screen.getByText("Despesas Fixas")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText("Rent")).toBeInTheDocument();
        });
    });

    it("should open create dialog", async () => {
        (fixedExpenseService.getAll as any).mockResolvedValue([]);
        (categoryService.getAll as any).mockResolvedValue([]);
        (api.get as any).mockResolvedValue({ data: [] });

        render(<FixedExpenses />);

        await waitFor(() => expect(fixedExpenseService.getAll).toHaveBeenCalled());

        fireEvent.click(screen.getByText("Nova Despesa Fixa"));

        await waitFor(() => {
            // Check for dialog content
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });
    });
});
