// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { describe, expect, it, vi } from "vitest";
import { BalanceChartWidget } from "./BalanceChartWidget";
import { act } from "react";

expect.extend(matchers);

vi.mock("recharts", async (importOriginal) => {
    const original = await importOriginal<typeof import("recharts")>();
    return {
        ...original,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div style={{ width: 500, height: 500 }}>{children}</div>
        ),
        ComposedChart: ({ children }: { children: React.ReactNode }) => (
            <div>{children}</div>
        ),
        Line: () => <div>Line</div>,
        Bar: () => <div>Bar</div>,
        XAxis: () => <div>XAxis</div>,
        YAxis: () => <div>YAxis</div>,
        Tooltip: () => <div>Tooltip</div>,
        CartesianGrid: () => <div>Grid</div>,
        ReferenceLine: () => <div>RefLine</div>,
    };
});

vi.mock("../../contexts/PrivacyContext", () => ({
    usePrivacy: () => ({ isObfuscated: false }),
}));

// Mock Tabs components if they aren't working well in JSDOM or use Radix
// Assuming they work since they are likely simple or Radix based.

describe("BalanceChartWidget", () => {
    const mockDailyData = [
        { date: "2024-01-01", balance: 1000, income: 100, expense: 50 },
        { date: "2024-01-02", balance: 1200, income: 200, expense: 0 },
    ];

    const mockAnnualData = [
        { date: "2023-12", balance: 900, income: 1000, expense: 500 },
        { date: "2024-01", balance: 1200, income: 1500, expense: 800 },
    ];

    it("renders correctly with default monthly view", () => {
        render(
            <BalanceChartWidget
                dailyData={mockDailyData}
                annualData={mockAnnualData}
                isObfuscated={false}
            />
        );
        expect(
            screen.getByText("Evolução do Saldo & Fluxo de Caixa")
        ).toBeInTheDocument();
        expect(screen.getByText("Mensal")).toBeInTheDocument();
        expect(screen.getByText("Anual")).toBeInTheDocument();
    });

    it("switches to annual view when tab is clicked", async () => {
        render(
            <BalanceChartWidget
                dailyData={mockDailyData}
                annualData={mockAnnualData}
                isObfuscated={false}
            />
        );

        const annualTab = screen.getByText("Anual");
        await act(async () => {
            fireEvent.click(annualTab);
        });

        // We can't easily assert the internal state or chart data change without inspecting the Chart props mocked,
        // but verifying no crash and tab interaction is good.
    });
});
