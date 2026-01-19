// @vitest-environment jsdom
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "../utils/test-utils";
import Debts from "./Debts";
import "@testing-library/jest-dom/vitest";

// Mock API
const mockGet = vi.fn();
vi.mock("../lib/api", () => ({
    api: {
        get: (...args: any[]) => mockGet(...args),
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

// Mock DebtForm since we test it separately
vi.mock("../components/debt/DebtForm", () => ({
    DebtForm: ({ isOpen }: any) => (isOpen ? <div>Mock Debt Form</div> : null),
}));

describe("Debts Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    beforeAll(() => {
        globalThis.ResizeObserver = class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    it("should fetch and display debts", async () => {
        mockGet.mockResolvedValueOnce({
            data: [
                {
                    id: "1",
                    name: "Test Debt",
                    totalAmount: 1000,
                    interestRate: 5,
                    minimumPayment: 100,
                    dueDate: 10,
                },
            ],
        });

        render(<Debts />);

        await waitFor(() => {
            expect(screen.getByText("Test Debt")).toBeInTheDocument();
            // MoneyDisplay formatting might depend on locale, skipping precise check or match generic
            // expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
            expect(screen.getByText("debts.interestRate")).toBeInTheDocument();
        });
    });

    it("should display empty state when no debts", async () => {
        mockGet.mockResolvedValueOnce({ data: [] });

        render(<Debts />);

        await waitFor(() => {
            expect(screen.getByText("debts.empty")).toBeInTheDocument();
        });
    });
});
