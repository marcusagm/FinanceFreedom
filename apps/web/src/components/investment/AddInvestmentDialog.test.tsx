/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AddInvestmentDialog } from "./AddInvestmentDialog";
import { api } from "../../lib/api";

afterEach(() => {
    cleanup();
});

// Mock api
vi.mock("../../lib/api", () => ({
    api: {
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

// Mock sonner
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock Translations
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                "investments.add.titleNew": "Nova Conta de Investimento",
                "investments.add.titleEdit": "Editar Conta",
                "investments.add.nameLabel": "Nome",
                "investments.add.namePlaceholder": "Ex: NuBank Caixinha",
                "investments.add.balanceLabel": "Saldo Atual",
                "investments.add.profitabilityLabel": "Rentabilidade",
                "investments.add.profitabilityTypeLabel": "Tipo Rentabilidade",
                "investments.add.maturityLabel": "Vencimento",
                "investments.add.descriptionLabel": "Descrição",
                "common.save": "Salvar",
                "common.saving": "Salvando...",
                "common.cancel": "Cancelar",
                "investments.types.FIXED_INCOME": "Renda Fixa",
                "investments.types.VARIABLE_INCOME": "Renda Variável",
                "investments.types.CRYPTO": "Cripto",
                "investments.types.CASH": "Caixa",
                "investments.types.OTHER": "Outro",
            };
            return translations[key] || key;
        },
    }),
}));

// Mock DatePicker
vi.mock("../ui/DatePicker", () => ({
    DatePicker: ({ date, setDate, placeholder }: any) => (
        <input
            data-testid="date-picker"
            placeholder={placeholder}
            value={
                date
                    ? typeof date === "string"
                        ? date
                        : date.toISOString().split("T")[0]
                    : ""
            }
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

describe("AddInvestmentDialog", () => {
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
    };

    it("renders form fields", () => {
        render(<AddInvestmentDialog {...mockProps} />);
        expect(
            screen.getByText("Nova Conta de Investimento"),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Ex: NuBank Caixinha"),
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText("R$ 0,00")).toBeInTheDocument();
    });

    it("submits new investment account", async () => {
        render(<AddInvestmentDialog {...mockProps} />);

        // Fill Name
        fireEvent.change(screen.getByPlaceholderText("Ex: NuBank Caixinha"), {
            target: { value: "My Invest" },
        });

        // Fill Balance
        fireEvent.change(screen.getByPlaceholderText("R$ 0,00"), {
            target: { value: "1000" },
        });

        // Fill Profitability
        fireEvent.change(screen.getByPlaceholderText("Ex: 100"), {
            target: { value: "12" },
        });

        // Submit
        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
        });
        expect(mockProps.onSuccess).toHaveBeenCalled();
    });

    it("renders edit mode with initial data", () => {
        const account = {
            id: "1",
            name: "Existing Invest",
            type: "FIXED_INCOME",
            balance: 5000,
            profitability: 10,
            profitabilityType: "CDI",
            maturityDate: "2030-01-01",
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: "user1",
        };

        render(<AddInvestmentDialog {...mockProps} accountToEdit={account} />);
        expect(screen.getByText("Editar Conta")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Existing Invest")).toBeInTheDocument();
        expect(screen.getByDisplayValue("10")).toBeInTheDocument(); // Profitability
    });
});
