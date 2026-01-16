/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RecentTransactionsWidget } from "./RecentTransactionsWidget";
import { api } from "../../lib/api";

// Mock API
vi.mock("../../lib/api", () => ({
    api: {
        get: vi.fn(),
    },
}));

// Mock React Router Link
vi.mock("react-router-dom", () => ({
    Link: ({ to, children, className }: any) => (
        <a href={to} className={className}>
            {children}
        </a>
    ),
}));

// Mock MoneyDisplay
vi.mock("../ui/MoneyDisplay", () => ({
    MoneyDisplay: ({ value }: { value: number }) => <span>R$ {value}</span>,
}));

describe("RecentTransactionsWidget", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading state initially", () => {
        (api.get as any).mockReturnValue(new Promise(() => {})); // Never resolves
        render(<RecentTransactionsWidget />);
        expect(screen.getByText("Transações Recentes")).toBeInTheDocument();
        expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });

    it("renders transactions when api returns data", async () => {
        const mockTransactions = [
            {
                id: "1",
                description: "Salary",
                amount: 5000,
                type: "INCOME",
                date: "2024-01-01T10:00:00",
                account: { name: "Bank A" },
            },
            {
                id: "2",
                description: "Groceries",
                amount: 200,
                type: "EXPENSE",
                date: "2024-01-02T15:00:00",
                account: { name: "Bank A" },
            },
        ];

        (api.get as any).mockResolvedValue({
            data: {
                data: mockTransactions,
                meta: { total: 2, page: 1, limit: 10 },
            },
        });

        render(<RecentTransactionsWidget />);

        await waitFor(() => {
            expect(screen.getByText("Salary")).toBeInTheDocument();
        });
        expect(screen.getByText("Groceries")).toBeInTheDocument();
        expect(screen.getByText("R$ 5000")).toBeInTheDocument();
    });

    it("handles invalid data format gracefully (empty list)", async () => {
        // Return object instead of array to trigger the fix
        (api.get as any).mockResolvedValue({ data: { some: "object" } });

        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        render(<RecentTransactionsWidget />);

        await waitFor(() => {
            expect(
                screen.getByText("Nenhuma transação recente.")
            ).toBeInTheDocument();
        });

        expect(consoleSpy).toHaveBeenCalledWith(
            "Invalid transactions data format:",
            { some: "object" }
        );
        consoleSpy.mockRestore();
    });
});
