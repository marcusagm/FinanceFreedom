// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { describe, expect, it, vi } from "vitest";
import { WorkUnitCard } from "./WorkUnitCard";

expect.extend(matchers);
import type { WorkUnit } from "../../services/income.service";

vi.mock("../../contexts/PrivacyContext", () => ({
    usePrivacy: () => ({ isObfuscated: false }),
}));

describe("WorkUnitCard", () => {
    const mockUnit: WorkUnit = {
        id: "unit-1",
        name: "Desenvolvimento Frontend",
        defaultPrice: 150.0,
        estimatedTime: 8,
        userId: "user-1",
    };

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    it("renders unit details correctly", () => {
        render(
            <WorkUnitCard
                unit={mockUnit}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText(mockUnit.name)).toBeInTheDocument();
        expect(
            screen.getByText(`Tempo Estimado: ${mockUnit.estimatedTime}h`)
        ).toBeInTheDocument();

        // MoneyDisplay should render formatted value
        // "R$ 150,00" might be split, or formatted differently depending on locale in test env
        // Checking for partial match or just presence is often safer if i18n is complex to mock
        // MoneyDisplay uses Intl.NumberFormat(pt-BR)
        expect(screen.getByText(/150,00/)).toBeInTheDocument();
    });

    it("triggers onEdit when edit button is clicked", () => {
        render(
            <WorkUnitCard
                unit={mockUnit}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const editButtons = screen.getAllByTitle("Editar");
        fireEvent.click(editButtons[0]);

        expect(mockOnEdit).toHaveBeenCalledWith(mockUnit);
    });

    it("triggers onDelete when delete button is clicked", () => {
        render(
            <WorkUnitCard
                unit={mockUnit}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const deleteButtons = screen.getAllByTitle("Excluir");
        fireEvent.click(deleteButtons[0]);

        expect(mockOnDelete).toHaveBeenCalledWith(mockUnit);
    });
});
