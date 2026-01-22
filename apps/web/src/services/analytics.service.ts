import { api } from "../lib/api";

export interface BudgetStatus {
    categoryId: string;
    categoryName: string;
    categoryColor: string | null;
    limit: number;
    spent: number;
    percentage: number;
    remaining: number;
    status: "NORMAL" | "WARNING" | "CRITICAL";
}

export interface HealthScore {
    score: number;
    date: string;
    details: {
        base: number;
        penalties: {
            debt: number;
        };
        bonuses: {
            investments: number;
            reserves: number;
        };
    };
}

export const analyticsService = {
    getBudgets: async (date?: string): Promise<BudgetStatus[]> => {
        const response = await api.get("/budgets", { params: { date } });
        return response.data;
    },

    upsertBudget: async (data: {
        categoryId: string;
        amount: number;
        date: string; // YYYY-MM-DD
    }) => {
        const response = await api.post("/budgets", data);
        return response.data;
    },

    getHealthScore: async (): Promise<HealthScore> => {
        const response = await api.get("/analytics/health-score");
        return response.data;
    },

    calculateHealthScore: async (): Promise<HealthScore> => {
        const response = await api.post("/analytics/health-score/calculate");
        return response.data;
    },

    getIncomes: async (date?: string): Promise<IncomeStatus[]> => {
        const response = await api.get("/analytics/incomes", {
            params: { date },
        });
        return response.data;
    },
};

export interface IncomeStatus {
    categoryId: string;
    categoryName: string;
    categoryColor: string | null;
    received: number;
    goal: number;
    percentage: number;
}
