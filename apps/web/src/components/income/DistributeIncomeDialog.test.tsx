import { render, screen, fireEvent } from "@testing-library/react";
import { DistributeIncomeDialog } from "./DistributeIncomeDialog";
import { vi } from "vitest";

describe("DistributeIncomeDialog", () => {
    const mockOnOpenChange = vi.fn();
    const mockOnConfirm = vi.fn();

    const defaultProps = {
        open: true,
        onOpenChange: mockOnOpenChange,
        onConfirm: mockOnConfirm,
        workUnitName: "Test Unit",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render correctly when open", () => {
        render(<DistributeIncomeDialog {...defaultProps} />);
        expect(screen.getByText('Distribuir "Test Unit"')).toBeInTheDocument();
        expect(screen.getByLabelText("Horas/Dia")).toBeInTheDocument();
    });

    it("should not render when closed", () => {
        render(<DistributeIncomeDialog {...defaultProps} open={false} />);
        expect(
            screen.queryByText('Distribuir "Test Unit"')
        ).not.toBeInTheDocument();
    });

    it("should update hours input", () => {
        render(<DistributeIncomeDialog {...defaultProps} />);
        const input = screen.getByLabelText("Horas/Dia");
        fireEvent.change(input, { target: { value: "6" } });
        expect(input).toHaveValue(6);
    });

    it("should update weekend checkbox", () => {
        render(<DistributeIncomeDialog {...defaultProps} />);
        const checkbox = screen.getByLabelText("Pular Finais de Semana");
        expect(checkbox).toBeChecked(); // Default state
        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
    });

    it("should call onConfirm with correct data", () => {
        render(<DistributeIncomeDialog {...defaultProps} />);

        // Change values
        const input = screen.getByLabelText("Horas/Dia");
        fireEvent.change(input, { target: { value: "4" } });

        const checkbox = screen.getByLabelText("Pular Finais de Semana");
        fireEvent.click(checkbox); // Uncheck

        // Submit
        fireEvent.click(screen.getByText("Distribuir"));

        expect(mockOnConfirm).toHaveBeenCalledWith({
            hoursPerDay: 4,
            skipWeekends: false,
        });
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("should close on cancel", () => {
        render(<DistributeIncomeDialog {...defaultProps} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
});
