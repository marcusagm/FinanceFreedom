import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WorkUnitCard } from "./WorkUnitCard";

describe("WorkUnitCard", () => {
    const mockUnit = {
        id: "1",
        name: "Freelance Hour",
        defaultPrice: 100,
        estimatedTime: 1,
    };

    const mockProps = {
        unit: mockUnit,
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    };

    it("renders unit info", () => {
        render(<WorkUnitCard {...mockProps} />);
        expect(screen.getByText("Freelance Hour")).toBeInTheDocument();
        expect(screen.getByText("Tempo Estimado: 1h")).toBeInTheDocument();
        expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it("calls onEdit", () => {
        render(<WorkUnitCard {...mockProps} />);
        fireEvent.click(screen.getByTitle("Editar"));
        expect(mockProps.onEdit).toHaveBeenCalledWith(mockUnit);
    });

    it("calls onDelete", () => {
        render(<WorkUnitCard {...mockProps} />);
        fireEvent.click(screen.getByTitle("Excluir"));
        expect(mockProps.onDelete).toHaveBeenCalledWith(mockUnit);
    });
});
