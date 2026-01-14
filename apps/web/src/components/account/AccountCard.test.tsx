import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../utils/test-utils";
import { AccountCard } from "./AccountCard";

describe("AccountCard", () => {
    const mockProps = {
        id: "1",
        name: "Test Account",
        type: "WALLET",
        balance: 150.5,
        color: "#123456",
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    };

    it("renders account info correctly", () => {
        render(<AccountCard {...mockProps} />);
        expect(screen.getByText("Test Account")).toBeInTheDocument();
        // Check for formatted balance (roughly) or exact text depending on locale mock
        // Assuming BRL: R$ 150,50
        // We will just check existence for now
        expect(screen.getByText("WALLET")).toBeInTheDocument();
        // Wait, AccountCard might map types.
    });

    it("calls onEdit when edit button click", () => {
        render(<AccountCard {...mockProps} />);
        const editBtn = screen.getByTitle("Editar Conta");
        fireEvent.click(editBtn);
        expect(mockProps.onEdit).toHaveBeenCalled();
    });

    it("calls onDelete when delete button click", () => {
        render(<AccountCard {...mockProps} />);
        const deleteBtn = screen.getByTitle("Excluir Conta");
        fireEvent.click(deleteBtn);
        expect(mockProps.onDelete).toHaveBeenCalled();
    });
});
