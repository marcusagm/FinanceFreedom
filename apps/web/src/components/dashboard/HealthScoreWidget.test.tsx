/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HealthScoreWidget } from "./HealthScoreWidget";
import { analyticsService } from "../../services/analytics.service";

// Mock Recharts
vi.mock("recharts", async (importOriginal) => {
    const original = await importOriginal<typeof import("recharts")>();
    return {
        ...original,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div style={{ width: 500, height: 500 }}>{children}</div>
        ),
        PieChart: ({ children }: { children: React.ReactNode }) => (
            <div>{children}</div>
        ),
        Pie: ({ data }: any) => (
            <div>
                {data.map((entry: any, index: number) => (
                    <div key={index} data-testid="pie-cell">
                        {entry.name}: {entry.value}
                    </div>
                ))}
            </div>
        ),
        Cell: () => null,
    };
});

// Mock analyticsService
vi.mock("../../services/analytics.service", () => ({
    analyticsService: {
        getHealthScore: vi.fn(),
        calculateHealthScore: vi.fn(),
    },
}));

describe("HealthScoreWidget", () => {
    const mockScore = {
        score: 850,
        status: "EXCELLENT",
        metrics: {
            savingsRate: 20,
            expenseRatio: 50,
            debtRatio: 10,
            emergencyFund: 100,
        },
        calculatedAt: new Date().toISOString(),
    };

    it("renders loading state initially", () => {
        (analyticsService.getHealthScore as any).mockReturnValue(
            new Promise(() => {})
        );
        render(<HealthScoreWidget />);
        expect(screen.getByText("Saúde Financeira")).toBeInTheDocument();
    });

    it("renders score when data is loaded", async () => {
        (analyticsService.getHealthScore as any).mockResolvedValue(mockScore);

        render(<HealthScoreWidget />);

        await waitFor(() => {
            expect(screen.getByText("850")).toBeInTheDocument();
        });
        expect(screen.getByText("Excelente")).toBeInTheDocument();
    });

    it("recalculates score when button is clicked", async () => {
        (analyticsService.getHealthScore as any).mockResolvedValue(mockScore);
        (analyticsService.calculateHealthScore as any).mockResolvedValue({
            ...mockScore,
            score: 900,
        });

        render(<HealthScoreWidget />);

        await waitFor(() => {
            expect(screen.getByText("850")).toBeInTheDocument();
        });

        const refreshButton = screen.getByTitle("Recalcular");
        fireEvent.click(refreshButton);

        await waitFor(() => {
            expect(analyticsService.calculateHealthScore).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText("900")).toBeInTheDocument();
        });
    });
});
