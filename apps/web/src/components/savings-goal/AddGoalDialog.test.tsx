/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AddGoalDialog } from "./AddGoalDialog";
import { api } from "../../lib/api";

afterEach(() => {
    cleanup();
});

// Mock api
vi.mock("../../lib/api", () => ({
    api: {
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

// Mock DatePicker
vi.mock("../ui/DatePicker", () => ({
    DatePicker: ({ date, setDate, placeholder }: any) => (
        <input
            data-testid="date-picker"
            placeholder={placeholder}
            value={
                date
                    ? typeof date === "string"
                        ? date
                        : date.toISOString().split("T")[0]
                    : ""
            }
            onChange={(e) =>
                setDate(
                    e.target.value
                        ? new Date(e.target.value + "T00:00:00")
                        : undefined
                )
            }
        />
    ),
}));

describe("AddGoalDialog", () => {
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
    };

    it("renders form fields", () => {
        render(<AddGoalDialog {...mockProps} />);
        expect(screen.getByText("Nova Meta de Economia")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Ex: Viagem para Japão")
        ).toBeInTheDocument();
    });

    it("submits new goal", async () => {
        render(<AddGoalDialog {...mockProps} />);

        fireEvent.change(screen.getByPlaceholderText("Ex: Viagem para Japão"), {
            target: { value: "Trip" },
        });

        // Currency Inputs
        const targetInput = screen.getAllByPlaceholderText("R$ 0,00")[0]; // Target
        fireEvent.change(targetInput, { target: { value: "5000" } });

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
        });
        expect(mockProps.onSuccess).toHaveBeenCalled();
    });

    it("renders edit mode", () => {
        const goal = {
            id: "1",
            name: "Existing Goal",
            targetAmount: 10000,
            currentAmount: 2000,
            deadline: "2025-01-01",
            priority: 1,
            userId: "user1",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        render(<AddGoalDialog {...mockProps} goalToEdit={goal} />);
        expect(screen.getByText("Editar Meta")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Existing Goal")).toBeInTheDocument();
    });
});
