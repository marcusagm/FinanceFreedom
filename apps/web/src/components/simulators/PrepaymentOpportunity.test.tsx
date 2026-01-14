import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { calculatePrepaymentSavings } from "../../services/simulator.service";
import { PrepaymentOpportunity } from "./PrepaymentOpportunity";

// Mock service
vi.mock("../../services/simulator.service", () => ({
    calculatePrepaymentSavings: vi.fn(),
}));

describe("PrepaymentOpportunity", () => {
    const mockProps = {
        debtName: "Loan",
        balance: 10000,
        interestRate: 2.5,
        minimumPayment: 500,
    };

    it("renders simulation form", () => {
        render(<PrepaymentOpportunity {...mockProps} />);
        expect(screen.getByText("Oportunidade de Antecipação")).toBeInTheDocument();
        expect(screen.getByText("Simular")).toBeInTheDocument();
    });

    it("calls simulation service and shows result", async () => {
        (calculatePrepaymentSavings as any).mockResolvedValue({
            moneySaved: 500,
            interestSaved: 200,
            monthsSaved: 2,
            originalTotal: 12000,
            newTotal: 11000,
            originalMonths: 12,
            newMonths: 10,
        });

        render(<PrepaymentOpportunity {...mockProps} />);

        fireEvent.click(screen.getByText("Simular"));

        await waitFor(() => {
            expect(calculatePrepaymentSavings).toHaveBeenCalled();
        });

        expect(await screen.findByText(/Economia de/)).toBeInTheDocument();
        expect(screen.getByText(/2 meses de liberdade/)).toBeInTheDocument();
    });
});
