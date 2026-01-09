import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChartTooltip } from "./ChartTooltip";

describe("ChartTooltip", () => {
    it("renders active tooltip with payload", () => {
        render(
            <ChartTooltip
                active={true}
                payload={[{ value: 100, name: "Data 1", color: "red" }]}
                label="Test Label"
            />
        );
        expect(screen.getByText("Test Label")).toBeInTheDocument();
        expect(screen.getByText("Data 1")).toBeInTheDocument();
        // Since currency formatting depends on locale, we check for presence of value digit '1'
        expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it("renders nothing if not active", () => {
        const { container } = render(
            <ChartTooltip
                active={false}
                payload={[{ value: 100, name: "Data 1", color: "red" }]}
                label="Test Label"
            />
        );
        expect(container).toBeEmptyDOMElement();
    });
});
