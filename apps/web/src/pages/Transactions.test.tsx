/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Transactions } from "./Transactions";
import { useTransactions } from "../hooks/useTransactions";
import { api } from "../lib/api";
import { categoryService } from "../services/category.service";

// Mock hooks
vi.mock("../hooks/useTransactions");

// Mock API and Service
vi.mock("../lib/api", () => ({
    api: {
        get: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock("../services/category.service", () => ({
    categoryService: {
        getAll: vi.fn(),
    },
}));

// Mock Child Components to simplify testing
vi.mock("../components/transactions/TransactionList", () => ({
    TransactionList: ({ transactions }: any) => (
        <div data-testid="transaction-list">
            {transactions.map((t: any) => (
                <div key={t.id}>{t.description}</div>
            ))}
        </div>
    ),
}));

vi.mock("../components/transactions/TransactionFilters", () => ({
    TransactionFilters: () => <div data-testid="filters">Filters</div>,
}));

vi.mock("../components/ui/PageHeader", () => ({
    PageHeader: ({ title }: any) => <h1>{title}</h1>,
}));

// Mock React Query
vi.mock("@tanstack/react-query", async (importOriginal) => {
    const original = await importOriginal<
        typeof import("@tanstack/react-query")
    >();
    return {
        ...original,
        useQueryClient: () => ({
            invalidateQueries: vi.fn(),
        }),
    };
});

describe("Transactions Page", () => {
    const mockUseTransactions = useTransactions as any;

    it("renders transaction list when data is loaded", async () => {
        // Setup Mocks
        (api.get as any).mockResolvedValue({ data: [] }); // Accounts
        (categoryService.getAll as any).mockResolvedValue([]); // Categories

        mockUseTransactions.mockReturnValue({
            data: {
                pages: [
                    {
                        data: [
                            { id: "1", description: "Test Transaction 1" },
                            { id: "2", description: "Test Transaction 2" },
                        ],
                    },
                ],
            },
            isLoading: false,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
        });

        render(<Transactions />);

        await waitFor(() => {
            expect(screen.getByText("Transações")).toBeInTheDocument();
        });

        expect(screen.getByText("Test Transaction 1")).toBeInTheDocument();
        expect(screen.getByText("Test Transaction 2")).toBeInTheDocument();
    });

    it("renders loading state", () => {
        mockUseTransactions.mockReturnValue({
            data: undefined,
            isLoading: true,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
        });

        render(<Transactions />);
        expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });

    it("renders 'Load More' button when hasNextPage is true", () => {
        const fetchNextPage = vi.fn();
        mockUseTransactions.mockReturnValue({
            data: { pages: [{ data: [] }] },
            isLoading: false,
            fetchNextPage,
            hasNextPage: true,
            isFetchingNextPage: false,
        });

        render(<Transactions />);

        const loadMoreBtns = screen.getAllByRole("button", {
            name: /Carregar Mais/i,
        });
        const loadMoreBtn = loadMoreBtns[0];
        expect(loadMoreBtn).toBeInTheDocument();

        fireEvent.click(loadMoreBtn);
        expect(fetchNextPage).toHaveBeenCalled();
    });
});
