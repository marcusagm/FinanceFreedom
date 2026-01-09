import { render, screen, waitFor, fireEvent } from "../utils/test-utils";
import Debts from "./Debts";
import { vi, describe, it, expect, beforeEach, beforeAll } from "vitest";
import "@testing-library/jest-dom";

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
        global.ResizeObserver = class ResizeObserver {
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
            expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
            expect(screen.getByText("5% a.m.")).toBeInTheDocument();
        });
    });

    it("should display empty state when no debts", async () => {
        mockGet.mockResolvedValueOnce({ data: [] });

        render(<Debts />);

        await waitFor(() => {
            expect(
                screen.getByText(/Nenhuma dívida cadastrada/i)
            ).toBeInTheDocument();
        });
    });
});
