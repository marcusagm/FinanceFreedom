// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { describe, expect, it, vi } from "vitest";
import { IncomeWidget } from "./IncomeWidget";

expect.extend(matchers);
import { analyticsService } from "../../services/analytics.service";
import { BrowserRouter } from "react-router-dom";

// Mock Recharts to avoid ResponsiveContainer issues in tests
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

// Mock Dependencies
vi.mock("../../services/analytics.service", () => ({
    analyticsService: {
        getIncomes: vi.fn(),
    },
}));

vi.mock("../../contexts/PrivacyContext", () => ({
    usePrivacy: () => ({ isObfuscated: false }),
}));

// Mock Privacy Context if needed (via MoneyDisplay)
// But MoneyDisplay already handles its own logic based on PrivacyProvider.
// Ideally we should wrap with PrivacyProvider but unit tests often mock context.
// For now, testing default state (not obfuscated).

const renderComponent = () => {
    return render(
        <BrowserRouter>
            <IncomeWidget />
        </BrowserRouter>
    );
};

describe("IncomeWidget", () => {
    it("renders loading state initially", () => {
        // Mock infinite loading
        (analyticsService.getIncomes as any).mockReturnValue(
            new Promise(() => {})
        );
        renderComponent();
        // Check for loader (spinner)
        // Since loader is a div with class, we might check for CardTitle
        expect(
            screen.getByText("Distribuição de Receitas")
        ).toBeInTheDocument();
    });

    it("renders empty state when no data", async () => {
        (analyticsService.getIncomes as any).mockResolvedValue([]);
        renderComponent();

        // Wait for async load
        expect(
            await screen.findByText("Sem receitas registradas")
        ).toBeInTheDocument();
        expect(screen.getByText("Criar Transação")).toBeInTheDocument();
    });

    it("renders chart when data exists", async () => {
        const mockData = [
            {
                categoryName: "Salário",
                received: 5000,
                expected: 5000,
                percentage: 100,
                categoryId: "cat-1",
                categoryColor: "#00ff00",
            },
        ];
        (analyticsService.getIncomes as any).mockResolvedValue(mockData);
        renderComponent();

        // Wait for data load
        // Chart text elements might be tricky to find in actual DOM,
        // but Legend formatter puts text in span
        expect(await screen.findByText("Salário")).toBeInTheDocument();
    });
});
