/**
 * @vitest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TransactionFilters } from "./TransactionFilters";

afterEach(() => {
    cleanup();
});

// Mock DatePicker
vi.mock("../ui/DatePicker", () => ({
    DatePicker: ({ date, setDate, placeholder }: any) => (
        <input
            data-testid="date-picker"
            placeholder={placeholder}
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) =>
                setDate(e.target.value ? new Date(e.target.value + "T00:00:00") : undefined)
            }
        />
    ),
}));

// Mock Select
vi.mock("../ui/Select", () => ({
    Select: ({ value, onChange, options, placeholder }: any) => (
        <select
            data-testid="select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={placeholder}
        >
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    ),
}));

describe("TransactionFilters", () => {
    const mockAccounts = [{ id: "acc1", name: "Wallet" }];
    const mockCategories = ["Food", "Transport"];
    const defaultFilters = {
        search: "",
        accountId: "all",
        category: "all",
        startDate: "",
        endDate: "",
    };
    const mockOnChange = vi.fn();

    it("renders all filters", () => {
        render(
            <TransactionFilters
                filters={defaultFilters}
                onChange={mockOnChange}
                accounts={mockAccounts}
                categories={mockCategories}
            />,
        );

        expect(screen.getByPlaceholderText("Buscar por descrição...")).toBeInTheDocument();
        expect(screen.getByLabelText("Conta")).toBeInTheDocument();
        expect(screen.getByLabelText("Categoria")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Início")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Fim")).toBeInTheDocument();
    });

    it("calls onChange when search input changes", () => {
        render(
            <TransactionFilters
                filters={defaultFilters}
                onChange={mockOnChange}
                accounts={mockAccounts}
                categories={mockCategories}
            />,
        );

        const searchInput = screen.getByPlaceholderText("Buscar por descrição...");
        fireEvent.change(searchInput, { target: { value: "Lunch" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultFilters,
            search: "Lunch",
        });
    });

    it("calls onChange when account is selected", () => {
        render(
            <TransactionFilters
                filters={defaultFilters}
                onChange={mockOnChange}
                accounts={mockAccounts}
                categories={mockCategories}
            />,
        );

        const accountSelect = screen.getByLabelText("Conta");
        fireEvent.change(accountSelect, { target: { value: "acc1" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultFilters,
            accountId: "acc1",
        });
    });

    it("calls onChange when date is selected", () => {
        render(
            <TransactionFilters
                filters={defaultFilters}
                onChange={mockOnChange}
                accounts={mockAccounts}
                categories={mockCategories}
            />,
        );

        const startDateInput = screen.getByPlaceholderText("Início");
        fireEvent.change(startDateInput, { target: { value: "2023-01-01" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultFilters,
            startDate: "2023-01-01",
        });
    });

    it("clears filters when clear button is clicked", () => {
        const activeFilters = {
            search: "Test",
            accountId: "acc1",
            category: "Food",
            startDate: "2023-01-01",
            endDate: "2023-01-31",
        };

        render(
            <TransactionFilters
                filters={activeFilters}
                onChange={mockOnChange}
                accounts={mockAccounts}
                categories={mockCategories}
            />,
        );

        const clearButton = screen.getByTestId("clear-filters-button");
        fireEvent.click(clearButton);

        expect(mockOnChange).toHaveBeenCalledWith(defaultFilters);
    });
});
