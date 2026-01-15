import { fireEvent, render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { describe, expect, it, vi } from "vitest";
import { CalendarDay } from "./CalendarDay";

// Mock DraggableWorkUnit to avoid dnd-kit complexity in unit test
vi.mock("./DraggableWorkUnit", () => ({
    DraggableWorkUnit: ({ workUnit }: any) => (
        <div data-testid="draggable-unit">{workUnit.name}</div>
    ),
}));

// Mock dnd-kit hooks since CalendarDay uses useDroppable
vi.mock("@dnd-kit/core", () => ({
    useDroppable: () => ({
        setNodeRef: vi.fn(),
        isOver: false,
    }),
}));

describe("CalendarDay", () => {
    const mockDate = new Date("2024-01-15T12:00:00Z");
    const mockProjections = [
        {
            id: "proj1",
            date: mockDate.toISOString(),
            amount: 100,
            status: "PLANNED",
            workUnit: { id: "w1", name: "Test Unit", defaultPrice: 100 },
        },
    ];
    const mockOnRemove = vi.fn();
    const mockOnStatusChange = vi.fn();
    const mockOnDistribute = vi.fn();

    const renderDay = (props: any = {}) => {
        return render(
            <CalendarDay
                date={mockDate}
                isCurrentMonth={true}
                projections={[]}
                onRemove={mockOnRemove}
                onStatusChange={mockOnStatusChange}
                onDistribute={mockOnDistribute}
                {...props}
            />
        );
    };

    it("renders the date correctly", () => {
        renderDay();
        // The component renders standard days like "15"
        expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("renders projections correctly", () => {
        renderDay({ projections: mockProjections });
        expect(screen.getByText("Test Unit")).toBeInTheDocument();
        // Check for formatted money - might appear multiple times (display + tooltip)
        expect(screen.getAllByText(/R\$\s?100,00/).length).toBeGreaterThan(0);
    });

    it("calls onRemove when remove button is clicked", () => {
        renderDay({ projections: mockProjections });
        // The remove button has title "Remover"
        const removeBtn = screen.getByTitle("Remover");
        fireEvent.click(removeBtn);
        expect(mockOnRemove).toHaveBeenCalledWith("proj1");
    });

    it("calls onStatusChange when status is clicked", () => {
        renderDay({ projections: mockProjections });
        // Use the container title to find the clickable element
        const statusItem = screen.getByTitle(
            "Clique para alterar status (Plano -> Feito -> Pago)"
        );
        fireEvent.click(statusItem);
        expect(mockOnStatusChange).toHaveBeenCalledWith("proj1", "DONE"); // Toggles to next status
    });

    it("renders distribute button when applicable", () => {
        renderDay({ projections: mockProjections });
        const distributeBtn = screen.getByTitle(
            "Distribuir (Dividir em vários dias)"
        );
        expect(distributeBtn).toBeInTheDocument();
        fireEvent.click(distributeBtn);
        expect(mockOnDistribute).toHaveBeenCalledWith(mockProjections[0]);
    });
});
