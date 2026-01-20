/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InstallmentsModal } from "./InstallmentsModal";

// Mock LocalizationContext
vi.mock("../../contexts/LocalizationContext", () => ({
    useLocalization: () => ({
        dateFormat: "dd/MM/yyyy",
        currency: "BRL",
        formatCurrency: (val: number) => `R$ ${val.toFixed(2)}`,
    }),
}));

// Mock Translations
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, options?: any) => {
            const translations: Record<string, string> = {
                "debts.installments.title": `Parcelas: ${options?.name}`,
                "debts.installments.subtitle": "Detalhes das parcelas",
                "debts.installments.paid": "pagas",
                "debts.installments.remaining": "restantes",
                "debts.installments.table.installment": "Parcela",
                "debts.installments.table.dueDate": "Vencimento",
                "debts.installments.table.status": "Status",
                "debts.installments.table.actions": "Ações",
                "debts.installments.status.paid": "Paga",
                "debts.installments.status.pending": "Pendente",
                "debts.installments.actions.markPending":
                    "Marcar como Pendente",
                "debts.installments.actions.markPaid": "Marcar como Paga",
            };
            return translations[key] || key;
        },
    }),
}));

afterEach(() => {
    cleanup();
});

describe("InstallmentsModal", () => {
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        installmentsTotal: 3,
        installmentsPaid: 1,
        firstInstallmentDate: "2024-01-01",
        dueDay: 10,
        debtName: "Credit Card Debt",
        onUpdatePaid: vi.fn(),
    };

    it("renders installment list correctly", () => {
        render(<InstallmentsModal {...mockProps} />);

        expect(
            screen.getByText("Parcelas: Credit Card Debt"),
        ).toBeInTheDocument();

        // Should show summary
        expect(screen.getByText("1 pagas")).toBeInTheDocument();
        expect(screen.getByText("2 restantes")).toBeInTheDocument();

        // 3 rows for installments
        expect(screen.getByText("1ª")).toBeInTheDocument();
        expect(screen.getByText("2ª")).toBeInTheDocument();
        expect(screen.getByText("3ª")).toBeInTheDocument();

        // Status checks (1st is paid, others pending)
        expect(screen.getAllByText("Paga").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Pendente").length).toBeGreaterThan(0);
    });

    it("calls onUpdatePaid when action button clicked", () => {
        render(<InstallmentsModal {...mockProps} />);

        // Find a button to toggle (e.g., mark 2nd as paid)
        // Implementation uses a Circle icon for pending and CheckCircle2 for paid, wrapped in a button

        // We can query all buttons in the table
        const buttons = screen.getAllByRole("button");
        // We expect close button + 3 installment buttons
        // Click one of the installment toggle buttons

        // Assuming the last button corresponds to the 3rd installment
        fireEvent.click(buttons[buttons.length - 1]);

        expect(mockProps.onUpdatePaid).toHaveBeenCalled();
    });
});
