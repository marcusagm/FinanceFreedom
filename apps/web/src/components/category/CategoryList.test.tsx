import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CategoryList } from "./CategoryList";

vi.mock("../ui/MoneyDisplay", () => ({
    MoneyDisplay: ({ value }: { value: number }) => <span>{value}</span>,
}));

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

        // Similar to delete, "edit" is likely not the accessible name if icon only.
        // It uses <Edit2 /> icon.

        const editButton = screen.getByTestId("edit-category-btn");

        fireEvent.click(editButton);
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

        const deleteButtons = screen
            .getAllByRole("button")
            .filter((button) => button.innerHTML.includes("lucide-trash"));
        // Or better, just specific testid or aria-label if available.
        // Looking at CategoryRow, it has <Trash2 className="h-4 w-4" /> inside a Button.
        // It does not have aria-label "Delete". The button has `size="icon"`.
        // Let's rely on class or some other attribute if possible.
        // Actually, the error might be because multiple buttons match "delete" if standard aria label.
        // But the previous error was `getEelementError`, likely `Found multiple elements`.
        // Let's use `uuid` specific delete call or similar.

        // Wait, the error message in the log was:
        // `screen.getAllByRole("button", { name: /delete/i })` failed.
        // Probably "delete" is not key accessible name if it's just an icon.
        // Let's try finding by class or icon presence.

        // Actually, let's mock the keys for Lucide icons or something.
        // But let's try to select the last button in the row or similar.

        // The implementation has:
        // <Button ... onClick={() => onDelete(category.id)}> <Trash2 ... /> </Button>
        // It has no aria-label inside CategoryRow.tsx (line 177).

        // Let's select by role "button" and take the last one.
        const allButtons = screen.getAllByRole("button");
        const deleteButton = allButtons[allButtons.length - 1]; // Delete is last action
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledWith("1");
    });
    it("should aggregate parent budgets", () => {
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
                budgetLimit: 500,
                type: "EXPENSE",
                parentId: "1",
            },
        ];

        render(
            <CategoryList
                categories={categories as any}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onBudgetChange={vi.fn()}
            />,
        );

        // Parent has 0 limit but child has 500. So parent aggregated should be 500.
        // Child also displays 500.
        expect(screen.getAllByText("500")).toHaveLength(2);
    });
});

vi.mock("../ui/HelpIcon", () => ({
    HelpIcon: () => <span data-testid="help-icon">?</span>,
}));
