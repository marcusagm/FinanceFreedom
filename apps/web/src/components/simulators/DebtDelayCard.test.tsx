import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DebtDelayCard } from "./DebtDelayCard";
import { vi, describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

// Mock Service
import * as SimulatorService from "../../services/simulator.service";
vi.mock("../../services/simulator.service", () => ({
    calculateDelayCost: vi.fn(),
}));

describe("DebtDelayCard", () => {
    const defaultProps = {
        debtName: "Credit Card",
        currentAmount: 1000,
        interestRate: 10, // 10%
        dueDate: new Date(),
        onClose: vi.fn(),
    };

    it("should calculate and display future values", async () => {
        // Setup mock return
        const mockResult = {
            totalCost: 1100,
            interest: 50,
            fine: 50,
            comparison: "Caro",
        };
        (SimulatorService.calculateDelayCost as any).mockResolvedValue(
            mockResult
        );

        render(<DebtDelayCard {...defaultProps} />);

        expect(screen.getByText("Validar Custo do Atraso")).toBeInTheDocument();

        // Simular
        fireEvent.click(screen.getByText("Simular"));

        // Wait for result
        await waitFor(() => {
            expect(screen.getByText(/R\$ 1.100,00/)).toBeInTheDocument();
            expect(screen.getByText(/Isso é caro!/i)).toBeInTheDocument();
        });
    });
});
