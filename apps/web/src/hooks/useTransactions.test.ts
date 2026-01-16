/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useTransactions } from "./useTransactions";
import { api } from "../lib/api";

// Mock React Query
const mockUseInfiniteQuery = vi.fn();
vi.mock("@tanstack/react-query", () => ({
    useInfiniteQuery: (...args: any[]) => mockUseInfiniteQuery(...args),
}));

// Mock API
vi.mock("../lib/api", () => ({
    api: {
        get: vi.fn(),
    },
}));

describe("useTransactions", () => {
    it("constructs correct query params", async () => {
        mockUseInfiniteQuery.mockReturnValue({
            data: { pages: [] },
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
        });

        const filters = {
            search: "grocery",
            accountId: "acc-1",
            category: "cat-1",
            startDate: "2023-01-01",
            endDate: "2023-01-31",
        };

        renderHook(() => useTransactions(filters));

        // Verify that useInfiniteQuery was called with correct keys
        expect(mockUseInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["transactions", filters],
            })
        );

        // To verify the queryFn logic, we'd need to invoke it.
        // Extract the queryFn passed to useInfiniteQuery
        const callArgs = mockUseInfiniteQuery.mock.calls[0][0];
        const queryFn = callArgs.queryFn;

        const mockApiGet = vi.mocked(api.get);
        mockApiGet.mockResolvedValue({ data: { data: [], meta: {} } });

        await queryFn({ pageParam: 1 });

        // Check if API was called with constructed params
        expect(mockApiGet).toHaveBeenCalledWith(
            expect.stringContaining("/transactions?")
        );
        expect(mockApiGet).toHaveBeenCalledWith(
            expect.stringContaining("search=grocery")
        );
        expect(mockApiGet).toHaveBeenCalledWith(
            expect.stringContaining("accountId=acc-1")
        );
        expect(mockApiGet).toHaveBeenCalledWith(
            expect.stringContaining("categoryId=cat-1")
        );
        expect(mockApiGet).toHaveBeenCalledWith(
            expect.stringContaining("startDate=2023-01-01")
        );
        expect(mockApiGet).toHaveBeenCalledWith(
            expect.stringContaining("endDate=2023-01-31")
        );
    });
});
