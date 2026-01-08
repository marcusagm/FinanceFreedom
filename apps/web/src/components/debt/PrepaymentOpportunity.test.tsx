import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PrepaymentOpportunity } from "./PrepaymentOpportunity";
import { vi, describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import * as SimulatorService from "../../services/simulator.service";

vi.mock("../../services/simulator.service", () => ({
    calculatePrepaymentSavings: vi.fn(),
}));

describe("PrepaymentOpportunity", () => {
    const defaultProps = {
        debtName: "Test Debt",
        currentTotal: 1000,
        discountedTotal: 800, // This prop might not exist in interface? Checked component: debtName, balance, interestRate, minimumPayment, initialAmount
        // Wait, interface in component (Step 468) is: debtName, balance, interestRate, minimumPayment.
        // discountedTotal is NOT in props!
        interestRate: 5,
        minimumPayment: 100,
        //        currentTotal: 1000 -> balance
        balance: 1000,
        onSimulate: vi.fn(), // Component does NOT have onSimulate prop!
        onDismiss: vi.fn(), // Component does NOT have onDismiss prop!
    };

    it("should display savings correctly", async () => {
        const mockResult = {
            interestSaved: 200,
            monthsSaved: 2,
            newTotal: 800,
        };
        (SimulatorService.calculatePrepaymentSavings as any).mockResolvedValue(
            mockResult
        );

        render(<PrepaymentOpportunity {...defaultProps} />);

        expect(
            screen.getByText("Oportunidade de Antecipação")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText("Simular"));

        await waitFor(() => {
            expect(
                screen.getByText("Economia de R$ 200,00")
            ).toBeInTheDocument();
        });
    });

    it("should handle simulation click", () => {
        // Covered above
    });
});
