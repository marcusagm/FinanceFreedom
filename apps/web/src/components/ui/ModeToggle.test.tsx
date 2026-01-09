import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ModeToggle } from "./ModeToggle";

// Mock the ThemeProvider
vi.mock("../providers/ThemeProvider", () => ({
    useTheme: () => ({
        setTheme: vi.fn(),
    }),
}));

describe("ModeToggle", () => {
    it("renders toggle button", () => {
        render(<ModeToggle />);
        expect(screen.getByText("Toggle theme")).toBeInTheDocument();
    });

    it("opens menu on click", async () => {
        render(<ModeToggle />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(await screen.findByText("Light")).toBeInTheDocument();
        expect(screen.getByText("Dark")).toBeInTheDocument();
        expect(screen.getByText("System")).toBeInTheDocument();
    });
});
