import { render, screen, waitFor } from "../utils/test-utils";

import Dashboard from "./Dashboard";
import { getDashboardSummary } from "../services/dashboard.service";
import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";

// Mock the service
vi.mock("../services/dashboard.service", () => ({
    getDashboardSummary: vi.fn(),
}));

// Mock Recharts components because they don't play well with JSDOM
vi.mock("recharts", () => ({
    LineChart: ({ children }: any) => (
        <div data-testid="line-chart">{children}</div>
    ),
    Line: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    ReferenceLine: () => <div />,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}));

describe("Dashboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading state initially", () => {
        (getDashboardSummary as any).mockImplementation(
            () => new Promise(() => {})
        ); // Never resolves
        render(<Dashboard />);
        expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
    });

    it("renders dashboard content after loading", async () => {
        (getDashboardSummary as any).mockResolvedValue({
            totalBalance: 1000,
            monthlyIncome: 500,
            monthlyExpenses: 200,
            chartData: [{ date: "2023-01-01", balance: 1000 }],
            recommendations: [
                {
                    type: "PAY_DEBT",
                    title: "Rec 1",
                    description: "Desc 1",
                    priority: "HIGH",
                    actionLabel: "Do it",
                    actionLink: "/do-it",
                },
            ],
        });

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText("Saldo Total")).toBeInTheDocument();
            // Use regex or simpler match for currency to avoid locale issues in test env if any
            // But we used explicit pt-BR formatting
            expect(screen.getByText(/R\$\s?1\.000,00/)).toBeInTheDocument();
            expect(screen.getByText("Receitas (Mês)")).toBeInTheDocument();
            expect(screen.getByText(/R\$\s?500,00/)).toBeInTheDocument();
            expect(screen.getByText("Despesas (Mês)")).toBeInTheDocument();
            expect(screen.getByText(/R\$\s?200,00/)).toBeInTheDocument();

            // Verify items from recommendations
            expect(screen.getByText("Rec 1")).toBeInTheDocument();
        });
    });

    it("renders error message on failure", async () => {
        (getDashboardSummary as any).mockRejectedValue(new Error("Failed"));

        render(<Dashboard />);

        await waitFor(() => {
            expect(
                screen.getByText("Failed to load dashboard data.")
            ).toBeInTheDocument();
        });
    });
});
