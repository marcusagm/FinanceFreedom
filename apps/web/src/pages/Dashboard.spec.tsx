import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDashboardSummary } from "../services/dashboard.service";
import { getHourlyRate } from "../services/simulator.service";
import { render, screen, waitFor } from "../utils/test-utils";
import Dashboard from "./Dashboard";

// Mock the services
vi.mock("../services/dashboard.service", () => ({
    getDashboardSummary: vi.fn(),
}));

vi.mock("../services/simulator.service", () => ({
    getHourlyRate: vi.fn(),
}));

vi.mock("../services/analytics.service", () => ({
    analyticsService: {
        getBudgets: vi.fn().mockResolvedValue([]),
        getIncomes: vi.fn().mockResolvedValue([]),
        getExpenses: vi.fn().mockResolvedValue([]),
    },
}));

vi.mock("../components/dashboard/IncomeWidget", () => ({
    IncomeWidget: () => <div data-testid="income-widget">IncomeWidget</div>,
}));
vi.mock("../components/dashboard/BudgetWidget", () => ({
    BudgetWidget: () => <div data-testid="budget-widget">BudgetWidget</div>,
}));
vi.mock("../components/dashboard/UpcomingInstallmentsWidget", () => ({
    UpcomingInstallmentsWidget: () => (
        <div data-testid="upcoming-widget">UpcomingInstallmentsWidget</div>
    ),
}));
vi.mock("../components/dashboard/ActionFeed", () => ({
    ActionFeed: () => <div data-testid="action-feed">ActionFeed</div>,
}));
vi.mock("../components/dashboard/HealthScoreWidget", () => ({
    HealthScoreWidget: () => (
        <div data-testid="health-widget">HealthScoreWidget</div>
    ),
}));
vi.mock("../components/dashboard/WealthWidget", () => ({
    WealthWidget: () => <div data-testid="wealth-widget">WealthWidget</div>,
}));
vi.mock("../components/dashboard/BalanceChartWidget", () => ({
    BalanceChartWidget: () => (
        <div data-testid="balance-chart">BalanceChartWidget</div>
    ),
}));
vi.mock("../components/dashboard/ExpenseSummaryWidget", () => ({
    ExpenseSummaryWidget: () => (
        <div data-testid="expense-summary">ExpenseSummaryWidget</div>
    ),
}));
vi.mock("../components/dashboard/IncomeSummaryWidget", () => ({
    IncomeSummaryWidget: () => (
        <div data-testid="income-summary">IncomeSummaryWidget</div>
    ),
}));

// Mock Recharts components
vi.mock("recharts", () => ({
    LineChart: ({ children }: any) => (
        <svg data-testid="line-chart">{children}</svg>
    ),
    Line: () => <g data-name="Line" />,
    XAxis: () => <g data-name="XAxis" />,
    YAxis: () => <g data-name="YAxis" />,
    CartesianGrid: () => <g data-name="CartesianGrid" />,
    Tooltip: () => <g data-name="Tooltip" />,
    ReferenceLine: () => <g data-name="ReferenceLine" />,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    PieChart: ({ children }: any) => (
        <svg data-testid="pie-chart">{children}</svg>
    ),
    Pie: ({ children }: any) => <g data-name="Pie">{children}</g>,
    Cell: () => <g data-name="Cell" />,
    Legend: () => <g data-name="Legend" />,
}));

describe("Dashboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock for getHourlyRate to avoid crashes
        (getHourlyRate as any).mockImplementation(() =>
            Promise.resolve({ hourlyRate: 0 })
        );
    });

    it("renders loading state initially", () => {
        (getDashboardSummary as any).mockImplementation(
            () => new Promise(() => {})
        );
        render(<Dashboard />);
        expect(screen.getByText("Carregando dashboard...")).toBeInTheDocument();
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
            totalInvested: 0,
            netWorth: 1000,
            totalDebt: 0,
        });
        (getHourlyRate as any).mockResolvedValue({ hourlyRate: 50 });
        // The mock above for analyticsService is static, we can also spy on it if needed, but it resolves to []

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByTestId("wealth-widget")).toBeInTheDocument();
            expect(screen.getByTestId("income-summary")).toBeInTheDocument();
            expect(screen.getByTestId("expense-summary")).toBeInTheDocument();
            expect(screen.getByTestId("balance-chart")).toBeInTheDocument();
        });
    });

    it("renders error message on failure", async () => {
        (getDashboardSummary as any).mockRejectedValue(
            new Error("Failed to load dashboard data")
        );

        render(<Dashboard />);

        await waitFor(() => {
            expect(
                screen.getByText("Failed to load dashboard data")
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Tentar Novamente" })
            ).toBeInTheDocument();
        });
    });
});
