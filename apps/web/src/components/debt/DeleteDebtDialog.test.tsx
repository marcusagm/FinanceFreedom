import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DeleteDebtDialog } from "./DeleteDebtDialog";

describe("DeleteDebtDialog", () => {
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
        debtName: "Credit Card",
        isDeleting: false,
    };

    it("renders dialog content", () => {
        render(<DeleteDebtDialog {...mockProps} />);
        expect(screen.getByText("Excluir Dívida")).toBeInTheDocument();
        expect(screen.getByText("Credit Card")).toBeInTheDocument();
    });

    it("calls onConfirm", () => {
        render(<DeleteDebtDialog {...mockProps} />);
        fireEvent.click(screen.getByText("Sim, excluir dívida"));
        expect(mockProps.onConfirm).toHaveBeenCalled();
    });
});
