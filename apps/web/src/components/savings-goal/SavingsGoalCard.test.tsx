/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SavingsGoalCard } from "./SavingsGoalCard";

afterEach(() => {
    cleanup();
});

describe("SavingsGoalCard", () => {
    const mockGoal = {
        id: "1",
        name: "Test Goal",
        targetAmount: 1000,
        currentAmount: 500, // 50%
        deadline: "2025-12-31",
        priority: 1,
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockProps = {
        goal: mockGoal,
        onEdit: vi.fn(),
        onDelete: vi.fn(),
    };

    it("renders goal details and progress", () => {
        render(<SavingsGoalCard {...mockProps} />);
        expect(screen.getByText("Test Goal")).toBeInTheDocument();
        expect(screen.getByText(/R\$ 500,00/)).toBeInTheDocument(); // Current string
        expect(screen.getByText(/de R\$ 1.000,00/)).toBeInTheDocument(); // Target string
        expect(screen.getByText("50%")).toBeInTheDocument(); // Percentage
    });
});
