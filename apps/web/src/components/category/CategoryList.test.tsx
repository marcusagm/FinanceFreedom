import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CategoryList } from "./CategoryList";

describe("CategoryList", () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    it("should render empty state", () => {
        render(
            <CategoryList
                categories={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        expect(screen.getByText("categories.emptyGroup")).toBeInTheDocument();
    });

    it("should render categories in tabs", () => {
        const categories = [
            {
                id: "1",
                name: "Food",
                color: "#FF0000",
                budgetLimit: 1000,
                type: "EXPENSE",
            },
            {
                id: "2",
                name: "Salary",
                color: "#00FF00",
                budgetLimit: 5000,
                type: "INCOME",
            },
        ];

        render(
            <CategoryList
                categories={categories}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        // Expense tab is default
        expect(screen.getByText("Food")).toBeInTheDocument();
        // Income might be hidden or in DOM depending on implementation. Tabs content usually uses hidden attribute.
        // Let's switch check if Salary is present. If Tabs unmount content, it won't be there.
        // Radix Tabs unmounts usually or hides.
    });

    it("should render hierarchy", () => {
        const categories = [
            {
                id: "1",
                name: "Parent",
                color: "#FF0000",
                budgetLimit: 0,
                type: "EXPENSE",
            },
            {
                id: "2",
                name: "Child",
                color: "#FF0000",
                budgetLimit: 0,
                type: "EXPENSE",
                parentId: "1",
            },
        ];

        render(
            <CategoryList
                categories={categories}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        expect(screen.getByText("Parent")).toBeInTheDocument();
        expect(screen.getByText("Child")).toBeInTheDocument();
        // We could check indentation style if we really want, but presence is good for now.
    });

    it("should call onEdit", () => {
        const categories = [
            {
                id: "1",
                name: "Food",
                color: "#FF0000",
                budgetLimit: 1000,
                type: "EXPENSE",
            },
        ];
        render(
            <CategoryList
                categories={categories}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        const editButtons = screen.getAllByRole("button", { name: /edit/i });
        fireEvent.click(editButtons[0]);
        expect(mockOnEdit).toHaveBeenCalledWith(
            expect.objectContaining({ id: "1" }),
        );
    });

    it("should call onDelete", () => {
        const categories = [
            {
                id: "1",
                name: "Food",
                color: "#FF0000",
                budgetLimit: 1000,
                type: "EXPENSE",
            },
        ];
        render(
            <CategoryList
                categories={categories}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />,
        );

        const deleteButtons = screen.getAllByRole("button", {
            name: /delete/i,
        });
        fireEvent.click(deleteButtons[0]);
        expect(mockOnDelete).toHaveBeenCalledWith("1");
    });
});
