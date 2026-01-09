import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AppAlert } from "./AppAlert";

describe("AppAlert", () => {
    it("renders title and description", () => {
        render(<AppAlert title="Notice" description="Info here" />);
        expect(screen.getByText("Notice")).toBeInTheDocument();
        expect(screen.getByText("Info here")).toBeInTheDocument();
    });

    it("renders children", () => {
        render(
            <AppAlert title="Notice">
                <span>Child Content</span>
            </AppAlert>
        );
        expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("renders correct icons for variants", () => {
        // We can't easily check icon content svg paths without snapshots,
        // but we can check if it renders without crashing and applies style classes.
        const { rerender } = render(
            <AppAlert title="Test" variant="destructive" />
        );
        // Destructive
        expect(screen.getByRole("alert")).toHaveClass("border-red-200");

        rerender(<AppAlert title="Test" variant="success" />);
        expect(screen.getByRole("alert")).toHaveClass("border-emerald-200");
    });
});
