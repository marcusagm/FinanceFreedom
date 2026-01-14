import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryList } from "./CategoryList";
import { vi, describe, it, expect } from "vitest";

describe("CategoryList", () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    it("should render empty state", () => {
        render(
            <CategoryList
                categories={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        expect(
            screen.getByText(
                "Nenhuma categoria encontrada. Crie sua primeira categoria!"
            )
        ).toBeInTheDocument();
    });

    it("should render categories", () => {
        const categories = [
            { id: "1", name: "Food", color: "#FF0000", budgetLimit: 1000 },
            { id: "2", name: "Transport", color: "#00FF00", budgetLimit: 500 },
        ];

        render(
            <CategoryList
                categories={categories}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText("Food")).toBeInTheDocument();
        expect(screen.getByText("Transport")).toBeInTheDocument();
        expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
        expect(screen.getByText("R$ 500,00")).toBeInTheDocument();
    });

    it("should call onEdit when edit button is clicked", () => {
        const categories = [
            { id: "1", name: "Food", color: "#FF0000", budgetLimit: 1000 },
        ];

        render(
            <CategoryList
                categories={categories}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        // Assuming edit button is the first button in the row's actions
        // Better to use aria-label or role if possible, but based on code it is an icon button
        // Let's rely on finding by row and then button
        const editButtons = screen.getAllByRole("button");
        // The list is inside a Table, buttons are inside cells.
        // Depending on DOM structure, we might need to be specific.
        // Let's use the implementation details that it has Edit2 icon or similar.
        // Or cleaner: create test ids. But let's look at the component code again.
        // It has <Edit2 className="h-4 w-4" /> inside a button.

        // Actually, simplest way without adding testIds is accessing calls.
        fireEvent.click(editButtons[0]); // Be careful if there are other buttons.

        expect(mockOnEdit).toHaveBeenCalledWith(categories[0]);
    });

    it("should call onDelete when delete button is clicked", () => {
        const categories = [
            { id: "1", name: "Food", color: "#FF0000", budgetLimit: 1000 },
        ];

        render(
            <CategoryList
                categories={categories}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const deleteButtons = screen.getAllByRole("button");
        // Assuming delete is the second button
        fireEvent.click(deleteButtons[1]);

        expect(mockOnDelete).toHaveBeenCalledWith("1");
    });
});
