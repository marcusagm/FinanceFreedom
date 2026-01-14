import { api } from "../lib/api";

export interface ActionRecommendation {
    type: "PAY_DEBT" | "INVEST" | "INCOME_GAP";
    title: string;
    description: string;
    actionLabel: string;
    actionLink: string;
    priority: "HIGH" | "MEDIUM" | "CRITICAL";
}

export interface DashboardSummary {
    totalBalance: number;
    totalInvested: number;
    totalDebt: number;
    netWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    chartData: { date: string; balance: number }[];
    recommendations: ActionRecommendation[];
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>("/dashboard/summary");
    return response.data;
};
