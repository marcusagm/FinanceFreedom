import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpcomingInstallmentsWidget } from "./UpcomingInstallmentsWidget";
import { LocalizationProvider } from "../../contexts/LocalizationContext";
import { BrowserRouter } from "react-router-dom";
import { api } from "../../lib/api";

// Mock api
vi.mock("../../lib/api", () => ({
    api: {
        get: vi.fn(),
    },
}));

// Mock LocalizationContext
vi.mock("../../contexts/LocalizationContext", async () => {
    const actual = await vi.importActual("../../contexts/LocalizationContext");
    return {
        ...actual,
        useLocalization: () => ({
            dateFormat: "dd/MM/yyyy",
            currency: "BRL",
            formatCurrency: (val: number) => `R$ ${val.toFixed(2)}`,
        }),
        LocalizationProvider: ({ children }: any) => <>{children}</>,
    };
});

// Mock translation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, options?: any) => {
            if (key === "dashboard.upcomingInstallments.installment")
                return `${options.number}ª`;
            return key;
        },
    }),
}));

// Mock MoneyDisplay
vi.mock("../ui/MoneyDisplay", () => ({
    MoneyDisplay: ({ value }: { value: number }) => (
        <span>R$ {value.toFixed(2)}</span>
    ),
}));

describe("UpcomingInstallmentsWidget", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render loading state initially", () => {
        // Mock unfinished promise to keep loading state
        (api.get as any).mockReturnValue(new Promise(() => {}));

        render(
            <BrowserRouter>
                <UpcomingInstallmentsWidget />
            </BrowserRouter>,
        );

        expect(screen.getByText("common.loading")).toBeInTheDocument();
    });

    it("should render installments when api returns debts", async () => {
        const debts = [
            {
                id: "1",
                name: "TV",
                totalAmount: 1000,
                installmentsTotal: 10,
                installmentsPaid: 0,
                firstInstallmentDate: "2024-01-20",
                dueDate: 10,
            },
        ];

        (api.get as any).mockResolvedValue({ data: debts });

        render(
            <BrowserRouter>
                <UpcomingInstallmentsWidget />
            </BrowserRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText("TV")).toBeInTheDocument();
            expect(screen.getByText("1ª")).toBeInTheDocument();
            expect(screen.getByText("R$ 100.00")).toBeInTheDocument();
        });
    });

    it("should render empty state when no upcoming installments", async () => {
        const debts = [
            {
                id: "1",
                name: "TV",
                totalAmount: 1000,
                installmentsTotal: 10,
                installmentsPaid: 10, // All paid
                firstInstallmentDate: "2024-01-20",
                dueDate: 10,
            },
        ];

        (api.get as any).mockResolvedValue({ data: debts });

        render(
            <BrowserRouter>
                <UpcomingInstallmentsWidget />
            </BrowserRouter>,
        );

        await waitFor(() => {
            expect(
                screen.getByText("dashboard.upcomingInstallments.empty"),
            ).toBeInTheDocument();
        });
    });
});
