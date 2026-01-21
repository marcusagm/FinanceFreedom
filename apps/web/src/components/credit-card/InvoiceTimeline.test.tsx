import { render, screen, fireEvent } from "@testing-library/react";
import { InvoiceTimeline } from "./InvoiceTimeline";
import { vi } from "vitest";
import { LocalizationContext } from "../../contexts/LocalizationContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../../lib/i18n"; // Assuming this is the setup file

// Mock dependencies
vi.mock("sonner", () => ({
    toast: {
        info: vi.fn(),
    },
}));

const mockInvoice = {
    status: "OPEN" as const,
    total: 1500.5,
    period: {
        start: "2023-10-26T00:00:00.000Z",
        end: "2023-11-25T00:00:00.000Z",
    },
    dueDate: "2023-12-05T00:00:00.000Z",
    transactions: [],
};

const renderWithContext = (ui: React.ReactNode, dateFormat = "dd/MM/yyyy") => {
    return render(
        <I18nextProvider i18n={i18n}>
            <LocalizationContext.Provider
                value={{
                    dateFormat,
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

describe("InvoiceTimeline", () => {
    it("renders invoice details correctly", () => {
        renderWithContext(
            <InvoiceTimeline
                invoice={mockInvoice}
                onMonthChange={vi.fn()}
                onPayInvoice={vi.fn()}
            />,
        );

        expect(screen.getByText("R$ 1500.50")).toBeInTheDocument();
        // Check for Period dates (formatted as dd/MM in component)
        expect(screen.getByText(/26\/10/)).toBeInTheDocument();
        expect(screen.getByText(/25\/11/)).toBeInTheDocument();
        // Check for Due Date
        expect(screen.getByText(/05\/12\/2023/)).toBeInTheDocument();
    });

    it("calls onMonthChange when arrows are clicked", () => {
        const onMonthChange = vi.fn();
        renderWithContext(
            <InvoiceTimeline
                invoice={mockInvoice}
                onMonthChange={onMonthChange}
                onPayInvoice={vi.fn()}
            />,
        );

        const buttons = screen.getAllByRole("button");
        // Looking for ChevronLeft (first button)
        fireEvent.click(buttons[0]);
        expect(onMonthChange).toHaveBeenCalledWith(-1);

        // Looking for ChevronRight (second button?)
        // Note: Date navigation buttons are at the top. The "Pay Invoice" button is conditional.
        // Assuming first two buttons are navigation.
        fireEvent.click(buttons[1]);
        expect(onMonthChange).toHaveBeenCalledWith(1);
    });

    it("shows Pay Invoice button when status is CLOSED", () => {
        const closedInvoice = { ...mockInvoice, status: "CLOSED" as const };
        const onPayInvoice = vi.fn();

        renderWithContext(
            <InvoiceTimeline
                invoice={closedInvoice}
                onMonthChange={vi.fn()}
                onPayInvoice={onPayInvoice}
            />,
        );

        const payButton = screen.getByText("creditCard.payInvoice"); // Translation key or mocked text
        expect(payButton).toBeInTheDocument();
        fireEvent.click(payButton);
        expect(onPayInvoice).toHaveBeenCalled();
    });

    it("does not show Pay Invoice button when status is OPEN", () => {
        renderWithContext(
            <InvoiceTimeline
                invoice={mockInvoice}
                onMonthChange={vi.fn()}
                onPayInvoice={vi.fn()}
            />,
        );

        expect(
            screen.queryByText("creditCard.payInvoice"),
        ).not.toBeInTheDocument();
    });
});
