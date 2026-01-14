import { DndContext } from "@dnd-kit/core";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../utils/test-utils";
import { CalendarDay } from "./CalendarDay";

describe("CalendarDay", () => {
    const mockDate = new Date("2024-01-10T00:00:00");
    const mockProjections = [
        {
            id: "1",
            workUnit: { name: "Test Unit", defaultPrice: 100 },
            amount: 100,
            status: "PLANNED",
        },
    ];
    const mockOnRemove = vi.fn();
    const mockOnStatusChange = vi.fn();
    const mockOnDistribute = vi.fn();

    const renderComponent = (props: any = {}) => {
        return render(
            <DndContext>
                <CalendarDay
                    date={mockDate}
                    isCurrentMonth={true}
                    projections={mockProjections}
                    onRemove={mockOnRemove}
                    onStatusChange={mockOnStatusChange}
                    onDistribute={mockOnDistribute}
                    {...props}
                />
            </DndContext>,
        );
    };

    it("should render date and projections", () => {
        renderComponent();
        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText("Test Unit")).toBeInTheDocument();
    });

    it("should call onStatusChange when item is clicked", () => {
        renderComponent();
        const item = screen.getByText("Test Unit").closest("div.group")!;
        fireEvent.click(item);
        expect(mockOnStatusChange).toHaveBeenCalledWith("1", "DONE");
    });

    it("should call onRemove when delete button is clicked", () => {
        renderComponent();
        const removeButton = screen.getByTitle("Remover");
        fireEvent.click(removeButton);
        expect(mockOnRemove).toHaveBeenCalledWith("1");
    });
});
