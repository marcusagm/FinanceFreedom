import { api } from "../lib/api";

export interface FixedExpense {
    id: string;
    description: string;
    amount: number;
    dueDay: number; // 1-31
    autoCreate: boolean;
    categoryId: string;
    accountId: string;
    startDate?: string;
    endDate?: string;
    category?: { name: string; color: string };
    account?: { name: string };
}

export interface CreateFixedExpenseDto {
    description: string;
    amount: number;
    dueDay: number;
    autoCreate: boolean;
    categoryId: string;
    accountId: string;
    startDate?: string;
    endDate?: string;
}

export const fixedExpenseService = {
    getAll: async () => {
        const response = await api.get("/fixed-expenses");
        return response.data;
    },

    create: async (data: CreateFixedExpenseDto) => {
        const response = await api.post("/fixed-expenses", data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateFixedExpenseDto>) => {
        const response = await api.patch(`/fixed-expenses/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/fixed-expenses/${id}`);
        return response.data;
    },
};
