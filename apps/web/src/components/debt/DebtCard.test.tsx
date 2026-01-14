import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../utils/test-utils";
import { DebtCard } from "./DebtCard";

afterEach(() => {
    cleanup();
});

// Mock children simulators
vi.mock("../simulators/DebtDelayCard", () => ({
    DebtDelayCard: () => <div data-testid="delay-simulator">DelaySimulator</div>,
}));

vi.mock("../simulators/PrepaymentOpportunity", () => ({
    PrepaymentOpportunity: () => <div data-testid="prepayment-simulator">PrepaymentSimulator</div>,
}));

vi.mock("../ui/AppCard", () => ({
    AppCard: ({ children, actions, footer, title, badge }: any) => (
        <div data-testid="app-card">
            <h1>{title}</h1>
            <div data-testid="badge">{badge}</div>
            <div data-testid="actions">{actions}</div>
            <div data-testid="content">{children}</div>
            <div data-testid="footer">{footer}</div>
        </div>
    ),
}));

describe("DebtCard", () => {
    const mockProps = {
        id: "1",
        name: "My Loan",
        totalAmount: 10000,
        interestRate: 2.5,
        minimumPayment: 500,
        dueDate: 15,
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    };

    it("renders basic info", () => {
        render(<DebtCard {...mockProps} />);
        expect(screen.getByText("My Loan")).toBeInTheDocument();
        expect(screen.getByText(/2.5% a.m./)).toBeInTheDocument();
        expect(screen.getByText(/10\.000/)).toBeInTheDocument();
    });

    it("toggles delay simulator", () => {
        render(<DebtCard {...mockProps} />);
        const btn = screen.getByTitle("Simular Custo do Atraso");
        fireEvent.click(btn);
        expect(screen.getByTestId("delay-simulator")).toBeInTheDocument();

        fireEvent.click(btn); // toggle off
        expect(screen.queryByTestId("delay-simulator")).not.toBeInTheDocument();
    });

    it("toggles prepayment simulator", () => {
        render(<DebtCard {...mockProps} />);
        const btn = screen.getByTitle("Simular Antecipação");
        fireEvent.click(btn);
        expect(screen.getByTestId("prepayment-simulator")).toBeInTheDocument();
    });

    it("calls onEdit", () => {
        render(<DebtCard {...mockProps} />);
        fireEvent.click(screen.getByTitle("Editar"));
        expect(mockProps.onEdit).toHaveBeenCalledWith("1");
    });

    it("calls onDelete", () => {
        render(<DebtCard {...mockProps} />);
        fireEvent.click(screen.getByTitle("Excluir"));
        expect(mockProps.onDelete).toHaveBeenCalledWith("1");
    });
});
