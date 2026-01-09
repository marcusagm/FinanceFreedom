import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteIncomeDialog } from "./DeleteIncomeDialog";
import { vi, describe, it, expect, beforeAll } from "vitest";
import "@testing-library/jest-dom";

describe("DeleteIncomeDialog", () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
        itemName: "Test Item",
        itemType: "SOURCE" as const, // Fix TS checking
        isDeleting: false,
    };

    beforeAll(() => {
        global.ResizeObserver = class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    it("should display correct message", () => {
        render(<DeleteIncomeDialog {...defaultProps} />);
        expect(
            screen.getByText(/será permanentemente removida/i)
        ).toBeInTheDocument();
        expect(screen.getByText("Test Item")).toBeInTheDocument();
    });

    it("should call onConfirm when confirmed", () => {
        render(<DeleteIncomeDialog {...defaultProps} />);
        fireEvent.click(screen.getByText("Sim, excluir"));
        expect(defaultProps.onConfirm).toHaveBeenCalled();
    });

    it("should disable button when deleting", () => {
        render(<DeleteIncomeDialog {...defaultProps} isDeleting={true} />);
        const button = screen.getByText("Excluindo...");
        expect(button).toBeDisabled();
    });
});
