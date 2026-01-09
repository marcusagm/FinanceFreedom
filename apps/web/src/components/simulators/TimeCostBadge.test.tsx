import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TimeCostBadge } from "./TimeCostBadge";

describe("TimeCostBadge", () => {
    it("renders calculated hours", () => {
        render(<TimeCostBadge amount={100} hourlyRate={50} />);
        expect(screen.getByText("2.0h of work")).toBeInTheDocument();
    });

    it("renders nothing if rate is 0", () => {
        const { container } = render(
            <TimeCostBadge amount={100} hourlyRate={0} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("renders minutes if less than 1 hour", () => {
        // 25 amount / 50 rate = 0.5h = 30m
        render(<TimeCostBadge amount={25} hourlyRate={50} />);
        expect(screen.getByText("30m of work")).toBeInTheDocument();
    });
});
