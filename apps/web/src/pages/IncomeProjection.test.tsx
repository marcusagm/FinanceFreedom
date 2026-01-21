import { render, screen } from "@testing-library/react";
import IncomeProjection from "./IncomeProjection";
import { vi } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../lib/i18n";
import { LocalizationContext } from "../contexts/LocalizationContext";
import { DndContext } from "@dnd-kit/core";

// Mock API and Services
vi.mock("../lib/api", () => ({
    api: {
        get: vi.fn().mockImplementation((url) => {
            if (url === "/income/work-units")
                return Promise.resolve({ data: [] });
            if (url.includes("/income/projection"))
                return Promise.resolve({ data: [] });
            return Promise.resolve({ data: [] });
        }),
    },
}));

vi.mock("../services/fixed-expense.service", () => ({
    fixedExpenseService: {
        getAll: vi.fn().mockResolvedValue([]),
    },
}));

// Mock DnD Kit to avoid errors in test environment if sensors fail
vi.mock("@dnd-kit/core", async () => {
    const actual = await vi.importActual("@dnd-kit/core");
    return {
        ...actual,
        DndContext: ({ children }: any) => <div>{children}</div>,
        useSensor: vi.fn(),
        useSensors: vi.fn(() => []),
        PointerSensor: {},
    };
});

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

describe("IncomeProjection", () => {
    it("renders page title and initial elements", () => {
        renderWithContext(<IncomeProjection />);

        // Check for headers (using translation keys or expected text if keys are loaded)
        // Since i18n mock might not load real keys, we count on what's visible.
        // Or we assume standard output from i18n.

        // Check for Expenses/Income/Balance dashboard
        expect(
            screen.getByText("incomeProjection.expensesLabel"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("incomeProjection.incomeLabel"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("incomeProjection.balanceLabel"),
        ).toBeInTheDocument();
    });
});
