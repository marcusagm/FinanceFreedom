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

// Mock Recharts components
vi.mock("recharts", () => ({
    LineChart: ({ children }: any) => <svg data-testid="line-chart">{children}</svg>,
    Line: () => <g data-name="Line" />,
    XAxis: () => <g data-name="XAxis" />,
    YAxis: () => <g data-name="YAxis" />,
    CartesianGrid: () => <g data-name="CartesianGrid" />,
    Tooltip: () => <g data-name="Tooltip" />,
    ReferenceLine: () => <g data-name="ReferenceLine" />,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}));

describe("Dashboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock for getHourlyRate to avoid crashes
        (getHourlyRate as any).mockImplementation(() => Promise.resolve({ hourlyRate: 0 }));
    });

    it("renders loading state initially", () => {
        (getDashboardSummary as any).mockImplementation(() => new Promise(() => {}));
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
        });
        (getHourlyRate as any).mockResolvedValue({ hourlyRate: 50 });

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText("Saldo Total")).toBeInTheDocument();
            expect(screen.getByText(/R\$\s?1\.000,00/)).toBeInTheDocument();
            expect(screen.getByText("Receitas (Mês)")).toBeInTheDocument();
            expect(screen.getByText(/R\$\s?500,00/)).toBeInTheDocument();
            expect(screen.getByText("Despesas (Mês)")).toBeInTheDocument();
            expect(screen.getByText(/R\$\s?200,00/)).toBeInTheDocument();
            expect(screen.getByText("Rec 1")).toBeInTheDocument();
        });
    });

    it("renders error message on failure", async () => {
        (getDashboardSummary as any).mockRejectedValue(new Error("Failed to load dashboard data"));

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText("Failed to load dashboard data")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Tentar Novamente" })).toBeInTheDocument();
        });
    });
});
