import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Transaction } from "../types";

export interface TransactionResponse {
    data: Transaction[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UseTransactionsProps {
    search?: string;
    accountId?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
}

export function useTransactions(filters: UseTransactionsProps) {
    return useInfiniteQuery<TransactionResponse>({
        queryKey: ["transactions", filters],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams();
            params.append("page", String(pageParam));
            params.append("limit", "50");

            if (filters.search) params.append("search", filters.search);
            if (filters.accountId && filters.accountId !== "all") {
                params.append("accountId", filters.accountId);
            }
            if (filters.category && filters.category !== "all") {
                // Assuming backend expects categoryId for the filter 'categoryId'
                params.append("categoryId", filters.category);
            }
            if (filters.startDate) params.append("startDate", filters.startDate);
            if (filters.endDate) params.append("endDate", filters.endDate);

            const { data } = await api.get<TransactionResponse>(
                `/transactions?${params.toString()}`,
            );
            return data;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.page < lastPage.meta.totalPages) {
                return lastPage.meta.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
}
