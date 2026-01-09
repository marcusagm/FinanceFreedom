import React from "react";
import { render, screen } from "../../utils/test-utils";
import { describe, it, expect, vi } from "vitest";
import { DraggableWorkUnit } from "./DraggableWorkUnit";

// Mock @dnd-kit/core
vi.mock("@dnd-kit/core", () => ({
    useDraggable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
    }),
}));

describe("DraggableWorkUnit", () => {
    const mockUnit = {
        id: "1",
        name: "Task",
        defaultPrice: 200,
        estimatedTime: 2,
    };

    it("renders work unit info", () => {
        render(<DraggableWorkUnit workUnit={mockUnit} />);
        expect(screen.getByText("Task")).toBeInTheDocument();
        expect(screen.getByText("2h")).toBeInTheDocument();
        expect(screen.getByText(/200/)).toBeInTheDocument();
    });
});
