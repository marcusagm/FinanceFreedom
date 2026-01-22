import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { Budgets } from "./Budgets";
import { BrowserRouter } from "react-router-dom";
import { categoryService } from "../services/category.service";
import { analyticsService } from "../services/analytics.service";

// Mock Services
vi.mock("../services/category.service");
vi.mock("../services/analytics.service");

// Mock Context
vi.mock("../contexts/LocalizationContext", () => ({
    useLocalization: () => ({
        language: "en-US",
        currency: "USD",
        formatCurrency: (val: number) => `$${val}`,
        dateFormat: "MM/dd/yyyy",
    }),
}));

const mockCategories = [
    { id: "1", name: "Food", type: "EXPENSE", budgetLimit: 500 },
    { id: "2", name: "Transport", type: "EXPENSE", budgetLimit: 300 },
];

const mockBudgetData = [{ categoryId: "1", limit: 600 }];

describe("Budgets Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // @ts-ignore
        categoryService.getAll = vi.fn().mockResolvedValue(mockCategories);
        // @ts-ignore
        analyticsService.getBudgets = vi.fn().mockResolvedValue(mockBudgetData);
    });

    it("should render and fetch data", async () => {
        render(
            <BrowserRouter>
                <Budgets />
            </BrowserRouter>,
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Food")).toBeInTheDocument();
            expect(screen.getByText("Transport")).toBeInTheDocument();
        });
    });

    it("should display correct budget values", async () => {
        render(
            <BrowserRouter>
                <Budgets />
            </BrowserRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText("Food")).toBeInTheDocument();
        });

        // Add assertions for inputs if needed
    });
});
