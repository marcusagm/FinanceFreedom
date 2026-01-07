import { api } from "../lib/api";

export interface DashboardSummary {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    chartData: { date: string; balance: number }[];
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>("/dashboard/summary");
    return response.data;
};
