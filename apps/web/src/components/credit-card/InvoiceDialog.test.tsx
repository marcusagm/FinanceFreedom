import { render, screen, fireEvent } from "@testing-library/react";
import { InvoiceDialog } from "./InvoiceDialog";
import { vi } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../lib/i18n";
import { LocalizationContext } from "../../contexts/LocalizationContext";

// Mock dependencies
const mockInvoice = {
    status: "OPEN" as const,
    total: 1200,
    period: { start: "2023-01-01", end: "2023-01-31" },
    dueDate: "2023-02-05",
    transactions: [],
};

vi.mock("@tanstack/react-query", () => ({
    useQuery: vi.fn(() => ({
        data: mockInvoice,
        isLoading: false,
    })),
}));

vi.mock("../../services/credit-card.service", () => ({
    creditCardService: {
        getInvoice: vi.fn(),
    },
}));

vi.mock("../ui/MoneyDisplay", () => ({
    MoneyDisplay: ({ value }: { value: number }) => (
        <span>R$ {value.toFixed(2)}</span>
    ),
}));

// Mock InvoiceTimeline to avoid deep rendering issues in unit test
vi.mock("./InvoiceTimeline", () => ({
    InvoiceTimeline: () => (
        <div data-testid="invoice-timeline">Mocked Timeline</div>
    ),
}));

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

describe("InvoiceDialog", () => {
    it("renders dialog with card limit", () => {
        const card = {
            id: "1",
            name: "My Card",
            brand: "Visa",
            limit: 5000,
            closingDay: 25,
            dueDay: 5,
            accountId: "acc1",
            userId: "u1",
        };

        renderWithContext(
            <InvoiceDialog
                isOpen={true}
                onClose={vi.fn()}
                card={card as any}
            />,
        );

        expect(screen.getByText("My Card")).toBeInTheDocument();
        // Check for limit with formatted value
        expect(screen.getByText(/5000/)).toBeInTheDocument();
    });

    it("renders InvoiceTimeline when data is loaded", () => {
        const card = {
            id: "1",
            name: "My Card",
            brand: "Visa",
            limit: 5000,
            closingDay: 25,
            dueDay: 5,
            accountId: "acc1",
            userId: "u1",
        };
        renderWithContext(
            <InvoiceDialog
                isOpen={true}
                onClose={vi.fn()}
                card={card as any}
            />,
        );

        expect(screen.getByTestId("invoice-timeline")).toBeInTheDocument();
    });
});
