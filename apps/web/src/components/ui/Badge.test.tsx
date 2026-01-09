import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
    it("renders badge content", () => {
        render(<Badge>New</Badge>);
        expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("applies variant classes", () => {
        render(<Badge variant="secondary">Secondary</Badge>);
        // Check for class associated with secondary variant
        expect(screen.getByText("Secondary")).toHaveClass("bg-secondary");
    });
});
