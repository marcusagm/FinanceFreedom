// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { describe, expect, it, vi } from "vitest";
import { BudgetWidget } from "./BudgetWidget";

expect.extend(matchers);
import { analyticsService } from "../../services/analytics.service";
import { BrowserRouter } from "react-router-dom";

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
        Pie: ({ data }: { data: any[] }) => (
            <div>
                {data.map((item) => (
                    <div key={item.name}>{item.name}</div>
                ))}
            </div>
        ),
        Tooltip: () => <div>Tooltip</div>,
        Legend: () => <div>Legend</div>,
        Cell: () => <div>Cell</div>,
    };
});

vi.mock("../../services/analytics.service", () => ({
    analyticsService: {
        getBudgets: vi.fn(),
    },
}));

vi.mock("../../contexts/PrivacyContext", () => ({
    usePrivacy: () => ({ isObfuscated: false }),
}));

const renderComponent = () => {
    return render(
        <BrowserRouter>
            <BudgetWidget />
        </BrowserRouter>
    );
};

describe("BudgetWidget", () => {
    it("renders loading state initially", () => {
        (analyticsService.getBudgets as any).mockReturnValue(
            new Promise(() => {})
        );
        renderComponent();
        expect(screen.getByText("Orçamento Mensal")).toBeInTheDocument();
    });

    it("renders empty state when no budgets", async () => {
        (analyticsService.getBudgets as any).mockResolvedValue([]);
        renderComponent();
        expect(
            await screen.findByText("Nenhum orçamento definido.")
        ).toBeInTheDocument();
    });

    it("renders chart when budgets exist", async () => {
        const mockData = [
            {
                categoryName: "Alimentação",
                spent: 400,
                limit: 500,
                percentage: 80,
                categoryId: "cat-1",
                categoryColor: "#ff0000",
            },
        ];
        (analyticsService.getBudgets as any).mockResolvedValue(mockData);
        renderComponent();

        // Check for Legend item
        expect(await screen.findByText("Alimentação")).toBeInTheDocument();
    });
});
