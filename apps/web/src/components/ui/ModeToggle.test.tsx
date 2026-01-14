import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { ModeToggle } from "./ModeToggle";

// Local mock for DropdownMenu that is super simple
vi.mock("./DropdownMenu", () => ({
    DropdownMenu: ({ children }: any) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children }: any) => <button>{children}</button>,
    DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
    DropdownMenuItem: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

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

    it("opens menu and shows items (always visible in mock)", async () => {
        render(<ModeToggle />);
        expect(screen.getByText("Light")).toBeInTheDocument();
        expect(screen.getByText("Dark")).toBeInTheDocument();
        expect(screen.getByText("System")).toBeInTheDocument();
    });
});
