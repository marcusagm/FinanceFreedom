/**
 * @vitest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mocks must be defined before imports that use them if possible, though Vitest hoists them.
// Mock LocalizationContext
vi.mock("../../contexts/LocalizationContext", () => ({
    useLocalization: () => ({
        currency: "BRL",
        dateFormat: "dd/MM/yyyy",
        formatCurrency: (val: number) => `R$ ${val}`,
    }),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: "pt-BR" },
    }),
}));

// Mock DatePicker
vi.mock("../ui/DatePicker", () => ({
    DatePicker: ({ date, setDate, placeholder }: any) => (
        <input
            data-testid="date-picker"
            placeholder={placeholder}
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) =>
                setDate(
                    e.target.value
                        ? new Date(e.target.value + "T00:00:00")
                        : undefined,
                )
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

// Mock PersonSelect
vi.mock("../person/PersonSelect", () => ({
    PersonSelect: ({ value, onChange, placeholder }: any) => (
        <input
            data-testid="person-select"
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

import { TransactionFilters } from "./TransactionFilters";

afterEach(() => {
    cleanup();
});

describe("TransactionFilters", () => {
    const mockAccounts = [{ id: "acc1", name: "Wallet" }];
    const mockCategories: any[] = [
        { id: "1", name: "Food", type: "EXPENSE" },
        { id: "2", name: "Transport", type: "EXPENSE" },
    ];
    const defaultFilters = {
        search: "",
        accountId: "all",
        category: "all",
        startDate: "",
        endDate: "",
        personId: "",
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

        expect(
            screen.getByPlaceholderText(
                "transactions.filters.searchPlaceholder",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText("transactions.filters.accountPlaceholder"),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText("transactions.filters.categoryPlaceholder"),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("transactions.filters.dateStart"),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("transactions.filters.dateEnd"),
        ).toBeInTheDocument();
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

        const searchInput = screen.getByPlaceholderText(
            "transactions.filters.searchPlaceholder",
        );
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

        const accountSelect = screen.getByLabelText(
            "transactions.filters.accountPlaceholder",
        );
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

        const startDateInput = screen.getByPlaceholderText(
            "transactions.filters.dateStart",
        );
        fireEvent.change(startDateInput, { target: { value: "2023-01-01" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultFilters,
            startDate: "2023-01-01",
        });
    });

    it("calls onChange when person is selected", () => {
        render(
            <TransactionFilters
                filters={defaultFilters}
                onChange={mockOnChange}
                accounts={mockAccounts}
                categories={mockCategories}
            />,
        );

        const personSelect = screen.getByTestId("person-select");
        fireEvent.change(personSelect, { target: { value: "p1" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultFilters,
            personId: "p1",
        });
    });

    it("clears filters when clear button is clicked", () => {
        const activeFilters = {
            search: "Test",
            accountId: "acc1",
            category: "Food",
            startDate: "2023-01-01",
            endDate: "2023-01-31",
            personId: "p1",
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

        expect(mockOnChange).toHaveBeenCalledWith({
            search: "",
            accountId: "all",
            category: "all",
            startDate: "",
            endDate: "",
            personId: "",
        });
    });
});
