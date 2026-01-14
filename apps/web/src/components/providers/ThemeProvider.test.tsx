import { act, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeProvider";

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

const TestComponent = () => {
    const { theme, setTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme-value">{theme}</span>
            <button onClick={() => setTheme("dark")}>Set Dark</button>
            <button onClick={() => setTheme("light")}>Set Light</button>
            <button onClick={() => setTheme("system")}>Set System</button>
        </div>
    );
};

describe("ThemeProvider", () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
        // Reset class list
        document.documentElement.className = "";
    });

    it("renders children", () => {
        render(
            <ThemeProvider>
                <div>Child Content</div>
            </ThemeProvider>,
        );
        expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("uses default theme if no storage", () => {
        render(
            <ThemeProvider defaultTheme="light">
                <TestComponent />
            </ThemeProvider>,
        );
        expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
        expect(document.documentElement).toHaveClass("light");
    });

    it("changes theme and updates DOM", () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>,
        );

        act(() => {
            screen.getByText("Set Dark").click();
        });

        expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
        expect(document.documentElement).toHaveClass("dark");
        expect(localStorageMock.setItem).toHaveBeenCalledWith("vite-ui-theme", "dark");
    });
});
