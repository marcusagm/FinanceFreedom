import { render, screen } from "@testing-library/react";
import { InvoiceTransactionList } from "./InvoiceTransactionList";
import { vi } from "vitest";
import { LocalizationContext } from "../../contexts/LocalizationContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../../lib/i18n";

const mockTransactions = [
    {
        id: "1",
        description: "Supermercado",
        amount: 250.0,
        date: "2023-11-15T10:00:00.000Z",
        category: {
            id: "cat1",
            name: "Alimentação",
            color: "#FF0000",
        },
    },
    {
        id: "2",
        description: "Uber",
        amount: 25.0,
        date: "2023-11-16T15:30:00.000Z",
        // No category
    },
];

const renderWithContext = (ui: React.ReactNode) => {
    return render(
        <I18nextProvider i18n={i18n}>
            <LocalizationContext.Provider
                value={{
                    dateFormat: "dd/MM/yyyy",
                    language: "pt-BR",
                    currency: "BRL",
                    setDateFormat: vi.fn(),
                    setLanguage: vi.fn(),
                    setCurrency: vi.fn(),
                    formatCurrency: (val) => `R$ ${val.toFixed(2)}`,
                    formatDate: (date) =>
                        new Date(date).toLocaleDateString("pt-BR"),
                }}
            >
                {ui}
            </LocalizationContext.Provider>
        </I18nextProvider>,
    );
};

describe("InvoiceTransactionList", () => {
    it("renders transactions correctly", () => {
        renderWithContext(
            <InvoiceTransactionList transactions={mockTransactions} />,
        );

        // Check descriptions
        expect(screen.getByText("Supermercado")).toBeInTheDocument();
        expect(screen.getByText("Uber")).toBeInTheDocument();

        // Check amounts
        expect(screen.getByText("R$ 250.00")).toBeInTheDocument();
        expect(screen.getByText("R$ 25.00")).toBeInTheDocument();

        // Check categories
        expect(screen.getByText("Alimentação")).toBeInTheDocument();

        // Check date formatting (assuming component uses dateFormat from context or localized helper)
        expect(screen.getByText("15/11/2023")).toBeInTheDocument();
    });

    it("renders empty state", () => {
        renderWithContext(<InvoiceTransactionList transactions={[]} />);
        expect(
            screen.getByText("creditCard.noTransactions"),
        ).toBeInTheDocument();
    });
});
