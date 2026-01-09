import { render, screen, fireEvent } from "@testing-library/react";
import { TransactionFilters } from "./TransactionFilters";
import { describe, it, expect, vi } from "vitest";

describe("TransactionFilters", () => {
    const defaultFilters = {
        search: "",
        accountId: "all",
        category: "all",
        startDate: "",
        endDate: "",
    };

    const mockAccounts = [
        {
            id: "1",
            name: "Nubank",
            balance: 100,
            type: "CHECKING",
            userId: "1",
        },
        { id: "2", name: "Inter", balance: 200, type: "SAVINGS", userId: "1" },
    ];

    const mockCategories = ["Food", "Transport", "Salary"];

    it("renders all filter inputs", () => {
        render(
            <TransactionFilters
                filters={defaultFilters}
                onChange={vi.fn()}
                accounts={mockAccounts}
                categories={mockCategories}
            />
        );

        expect(
            screen.getByPlaceholderText("Buscar por descrição...")
        ).toBeDefined();
        // Select trigger text is rendered
        expect(screen.getByText("Todas as Contas")).toBeDefined();
        expect(screen.getByText("Todas as Categorias")).toBeDefined();
        expect(screen.getByTitle("Data Inicial")).toBeDefined();
        expect(screen.getByTitle("Data Final")).toBeDefined();
    });

    it("calls onChange when search input changes", () => {
        const onChange = vi.fn();
        render(
            <TransactionFilters
                filters={defaultFilters}
                onChange={onChange}
                accounts={mockAccounts}
                categories={mockCategories}
            />
        );

        const input = screen.getByPlaceholderText("Buscar por descrição...");
        fireEvent.change(input, { target: { value: "Market" } });

        expect(onChange).toHaveBeenCalledWith({
            ...defaultFilters,
            search: "Market",
        });
    });

    it("calls onChange when clear filters button is clicked", () => {
        const onChange = vi.fn();
        const dirtyFilters = {
            search: "Test",
            accountId: "1",
            category: "Food",
            startDate: "2023-01-01",
            endDate: "2023-01-31",
        };

        render(
            <TransactionFilters
                filters={dirtyFilters}
                onChange={onChange}
                accounts={mockAccounts}
                categories={mockCategories}
            />
        );

        const clearButton = screen.getByRole("button", {
            name: /Limpar Filtros/i,
        });
        fireEvent.click(clearButton);

        expect(onChange).toHaveBeenCalledWith(defaultFilters);
    });
});
