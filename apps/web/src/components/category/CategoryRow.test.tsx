import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CategoryRow } from "./CategoryRow";
import { Category } from "../../services/category.service";

// Mocks
vi.mock("../ui/MoneyDisplay", () => ({
    MoneyDisplay: ({ value }: { value: number }) => <span>{value}</span>,
}));

vi.mock("../ui/Input", () => ({
    Input: ({ currency, onValueChange, ...props }: any) => (
        <input
            data-testid="mock-input"
            {...props}
            onChange={(e) =>
                onValueChange &&
                onValueChange({ floatValue: Number(e.target.value) })
            }
        />
    ),
}));

vi.mock("../ui/HelpIcon", () => ({
    HelpIcon: () => <span data-testid="help-icon">?</span>,
}));

vi.mock("../ui/Progress", () => ({
    Progress: ({ value }: { value: number }) => (
        <div data-testid="progress-bar" style={{ width: `${value}%` }} />
    ),
}));

describe("CategoryRow", () => {
    const mockCategory: Category = {
        id: "1",
        name: "Test Category",
        color: "#000",
        budgetLimit: 1000,
        type: "EXPENSE",
    };

    const defaultProps = {
        category: mockCategory,
        depth: 0,
        onEdit: vi.fn(),
        onDelete: vi.fn(),
        onBudgetChange: vi.fn(),
        isExpanded: false,
        hasChildren: false,
        toggle: vi.fn(),
    };

    it("should render category name and budget", () => {
        render(<CategoryRow {...defaultProps} />);
        expect(screen.getByText("Test Category")).toBeInTheDocument();
        // Budget limit (MoneyDisplay mocked)
        // 1000 renders twice: Progress Column (limit > 0) and Budget Column
        expect(screen.getAllByText("1000")).toHaveLength(2);
    });

    it("should indent based on depth", () => {
        const { container } = render(
            <CategoryRow {...defaultProps} depth={2} />,
        );
        // Finding the div with style paddingLeft.
        // The structure is: Name Column -> style={{ paddingLeft: `${depth * 24}px` }}
        const nameColumn = screen.getByText("Test Category").closest("div");
        // The parent of the text node is the Name Column or close to it.
        // Actually the code handles padding in the container of the name.
        // Let's check style directly if possible or trust visual test.
        // In JSDOM, style attributes are reflected.
        expect(nameColumn).toHaveStyle({ paddingLeft: "48px" });
    });

    it("should show progress bar for Expense with limit", () => {
        const budgetStatus = {
            spent: 500,
            limit: 1000,
            percentage: 50,
            categoryName: "Test",
            status: "NORMAL",
        };
        render(
            <CategoryRow
                {...defaultProps}
                budgetStatus={budgetStatus as any}
            />,
        );

        expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
        expect(screen.getByText("500")).toBeInTheDocument(); // Spent
        expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("should show progress for Income", () => {
        const incomeCategory: Category = { ...mockCategory, type: "INCOME" };
        const budgetStatus = {
            spent: 200, // Received
            limit: 1000, // Goal
            percentage: 20,
            categoryName: "Income",
            status: "NORMAL",
        };

        render(
            <CategoryRow
                {...defaultProps}
                category={incomeCategory}
                budgetStatus={budgetStatus as any}
            />,
        );

        // Verification logic matches general logic: Spent / Limit
        expect(screen.getByText("200")).toBeInTheDocument();
        expect(screen.getAllByText("1000")).toHaveLength(2);
    });

    it("should render read-only parent with HelpIcon", () => {
        render(<CategoryRow {...defaultProps} hasChildren={true} />);

        expect(screen.getByTestId("help-icon")).toBeInTheDocument();
        // Title should be "categories.parentBudgetAutomatic" passed to HelpIcon props.
        // We mocked HelpIcon so strictly we can't see props unless we spy.
        // But the input should NOT be present if we click.

        const budgetDisplay = screen.getAllByText("1000")[1]; // One in progress (maybe), one in budgetCol
        // Actually limit > 0 shows progress limit too.

        // Let's click the budget
        fireEvent.click(budgetDisplay);
        // Should NOT show textbox
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("should allow editing budget for leaf nodes", () => {
        render(<CategoryRow {...defaultProps} hasChildren={false} />);

        // Find the budget display in the budget column (last one likely)
        // Click it
        const displays = screen.getAllByText("1000");
        const budgetDisplay = displays[displays.length - 1]; // Heuristic

        fireEvent.click(budgetDisplay);

        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
});

// Mock translations
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    initReactI18next: {
        type: "3rdParty",
        init: () => {},
    },
}));
