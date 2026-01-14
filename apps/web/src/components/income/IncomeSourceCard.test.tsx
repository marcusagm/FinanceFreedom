import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../utils/test-utils";
import { IncomeSourceCard } from "./IncomeSourceCard";

describe("IncomeSourceCard", () => {
    const mockSource = {
        id: "1",
        name: "Job",
        amount: 5000,
        payDay: 5,
        currency: "BRL",
    };

    const mockProps = {
        source: mockSource,
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    };

    it("renders income info", () => {
        render(<IncomeSourceCard {...mockProps} />);
        expect(screen.getByText("Job")).toBeInTheDocument();
        expect(screen.getByText(/Recebe no dia 5/)).toBeInTheDocument();
        // Check formatted amount roughly
        expect(screen.getByText(/5\.000/)).toBeInTheDocument();
    });

    it("calls onEdit", () => {
        render(<IncomeSourceCard {...mockProps} />);
        fireEvent.click(screen.getByTitle("Editar"));
        expect(mockProps.onEdit).toHaveBeenCalledWith(mockSource);
    });

    it("calls onDelete", () => {
        render(<IncomeSourceCard {...mockProps} />);
        fireEvent.click(screen.getByTitle("Excluir"));
        expect(mockProps.onDelete).toHaveBeenCalledWith(mockSource);
    });
});
