import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { AppCard } from "./AppCard";

describe("AppCard", () => {
    it("renders title and children", () => {
        render(<AppCard title="My Card">Content</AppCard>);
        expect(screen.getByText("My Card")).toBeInTheDocument();
        expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders badge if provided", () => {
        render(
            <AppCard title="Card" badge="New">
                Content
            </AppCard>,
        );
        expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("renders actions if provided", () => {
        render(
            <AppCard title="Card" actions={<button>Action</button>}>
                Content
            </AppCard>,
        );
        expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    });

    it("renders footer if provided", () => {
        render(
            <AppCard title="Card" footer="Footer Info">
                Content
            </AppCard>,
        );
        expect(screen.getByText("Footer Info")).toBeInTheDocument();
    });

    it("handles click", () => {
        const handleClick = vi.fn();
        const { container } = render(
            <AppCard title="Card" onClick={handleClick}>
                Content
            </AppCard>,
        );

        // Find the specific card element - using the first child which is the Card div
        const card = container.firstChild;
        if (card) {
            fireEvent.click(card);
            expect(handleClick).toHaveBeenCalled();
        } else {
            throw new Error("Card container not found");
        }
    });
});
