import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";

describe("DeleteTransactionDialog", () => {
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
        description: "My Expense",
        isDeleting: false,
    };

    it("renders dialog content", () => {
        render(<DeleteTransactionDialog {...mockProps} />);
        expect(screen.getByText("Excluir Transação")).toBeInTheDocument();
        expect(screen.getByText("My Expense")).toBeInTheDocument();
    });

    it("calls onConfirm when confirmed", () => {
        render(<DeleteTransactionDialog {...mockProps} />);
        fireEvent.click(screen.getByText("Sim, excluir transação"));
        expect(mockProps.onConfirm).toHaveBeenCalled();
    });

    it("calls onClose when cancelled", () => {
        render(<DeleteTransactionDialog {...mockProps} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(mockProps.onClose).toHaveBeenCalled();
    });
});
