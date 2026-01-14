import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

describe("DeleteAccountDialog", () => {
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
        accountName: "My Bank",
        isDeleting: false,
    };

    it("renders dialog content", () => {
        render(<DeleteAccountDialog {...mockProps} />);
        expect(screen.getByText("Excluir Conta")).toBeInTheDocument();
        expect(screen.getByText(/esta ação não pode ser desfeita/i)).toBeInTheDocument();
        expect(screen.getByText("My Bank")).toBeInTheDocument();
    });

    it("calls onConfirm when confirmed", () => {
        render(<DeleteAccountDialog {...mockProps} />);
        fireEvent.click(screen.getByText("Sim, excluir conta"));
        expect(mockProps.onConfirm).toHaveBeenCalled();
    });

    it("calls onClose when cancelled", () => {
        render(<DeleteAccountDialog {...mockProps} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(mockProps.onClose).toHaveBeenCalled();
    });

    it("shows loading state", () => {
        render(<DeleteAccountDialog {...mockProps} isDeleting={true} />);
        expect(screen.getByText("Excluindo...")).toBeInTheDocument();
        expect(screen.getByText("Excluindo...")).toBeDisabled();
    });
});
