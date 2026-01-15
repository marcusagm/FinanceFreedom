// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { describe, expect, it, vi } from "vitest";
import { BalanceChartWidget } from "./BalanceChartWidget";

expect.extend(matchers);
import { MoneyDisplay } from "../ui/MoneyDisplay";

// Since BalanceChartWidget receives data via props, we don't mock services here.
// But we should verify it displays data.
// We also need to mock Recharts.

vi.mock("recharts", async (importOriginal) => {
    const original = await importOriginal<typeof import("recharts")>();
    return {
        ...original,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div style={{ width: 500, height: 500 }}>{children}</div>
        ),
        LineChart: ({ children }: { children: React.ReactNode }) => (
            <div>{children}</div>
        ),
        Line: () => <div>Line</div>,
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

describe("BalanceChartWidget", () => {
    const mockData = [
        { date: "2024-01-01", balance: 1000 },
        { date: "2024-01-02", balance: 1200 },
    ];

    it("renders correctly with data", () => {
        render(<BalanceChartWidget data={mockData} isObfuscated={false} />);
        expect(
            screen.getByText("Evolução do Saldo (30 dias)")
        ).toBeInTheDocument();
    });

    // Testing obfuscation in YAxis tickFormatter is hard via RTL since it renders SVG text.
    // However, we can trust MoneyDisplay tests for the Tooltip part.
});
