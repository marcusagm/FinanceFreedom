import { act, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import { systemConfigService } from "../../services/system-config.service";

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

// Mock AuthContext
const mockUseAuth = vi.fn();
vi.mock("../../contexts/AuthContext", () => ({
    useAuth: () => mockUseAuth(),
}));

// Mock SystemConfigService
vi.mock("../../services/system-config.service", () => ({
    systemConfigService: {
        getAll: vi.fn(),
        set: vi.fn().mockResolvedValue(true),
    },
}));

// Mock Themes Registry (to avoid reading real files)
vi.mock("../../registry/themes", () => ({
    themes: [
        {
            name: "zinc",
            activeColor: "hsl(240 5.9% 10%)",
            cssVars: {
                light: { "--primary": "zinc-light" },
                dark: { "--primary": "zinc-dark" },
            },
        },
        {
            name: "rose",
            activeColor: "hsl(346.8 77.2% 49.8%)",
            cssVars: {
                light: { "--primary": "rose-light" },
                dark: { "--primary": "rose-dark" },
            },
        },
    ],
}));

const TestComponent = () => {
    const {
        theme,
        setTheme,
        primaryColor,
        setPrimaryColor,
        radius,
        setRadius,
        privacyMode,
        setPrivacyMode,
    } = useTheme();
    return (
        <div>
            <span data-testid="theme-value">{theme}</span>
            <span data-testid="color-value">{primaryColor}</span>
            <span data-testid="radius-value">{radius}</span>
            <span data-testid="privacy-value">{String(privacyMode)}</span>

            <button onClick={() => setTheme("dark")}>Set Dark</button>
            <button onClick={() => setPrimaryColor("rose")}>Set Rose</button>
            <button onClick={() => setRadius(0.75)}>Set Radius</button>
            <button onClick={() => setPrivacyMode(true)}>Set Privacy</button>
        </div>
    );
};

describe("ThemeProvider", () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
        document.documentElement.className = "";
        document.documentElement.style.cssText = "";
        // Default to not authenticated
        mockUseAuth.mockReturnValue({ isAuthenticated: false });
        // Default system config config
        (systemConfigService.getAll as any).mockResolvedValue({});
    });

    it("renders children", () => {
        render(
            <ThemeProvider>
                <div>Child Content</div>
            </ThemeProvider>
        );
        expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("uses default values if no storage", () => {
        render(
            <ThemeProvider defaultTheme="light" defaultPrimaryColor="zinc">
                <TestComponent />
            </ThemeProvider>
        );
        expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
        expect(screen.getByTestId("color-value")).toHaveTextContent("zinc");
        expect(document.documentElement).toHaveClass("light");
    });

    it("persists theme mode to localStorage", () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        act(() => {
            screen.getByText("Set Dark").click();
        });

        expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            "vite-ui-theme",
            "dark"
        );
    });

    it("persists primary color to localStorage", () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        act(() => {
            screen.getByText("Set Rose").click();
        });

        expect(screen.getByTestId("color-value")).toHaveTextContent("rose");
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            "vite-ui-theme-primary",
            "rose"
        );
    });

    it("persists privacy mode to localStorage", () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        act(() => {
            screen.getByText("Set Privacy").click();
        });

        expect(screen.getByTestId("privacy-value")).toHaveTextContent("true");
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            "vite-ui-theme-privacy",
            "true"
        );
    });

    it("updates CSS variables when primary color changes", () => {
        render(
            <ThemeProvider defaultTheme="light">
                <TestComponent />
            </ThemeProvider>
        );

        // Should start with zinc defaults (mocked)
        // Note: Initial render effect might not trigger in this mocked env
        // without act wrapping or if state matches default.

        act(() => {
            screen.getByText("Set Rose").click();
        });

        // Check if style property was set on root
        expect(
            document.documentElement.style.getPropertyValue("--primary")
        ).toBe("rose-light");
    });

    it("updates Radius CSS variable", () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        act(() => {
            screen.getByText("Set Radius").click();
        });

        expect(
            document.documentElement.style.getPropertyValue("--radius")
        ).toBe("0.75rem");
    });

    describe("Authentication Integration", () => {
        it("saves settings to backend when authenticated", () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: true });

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            act(() => {
                screen.getByText("Set Dark").click();
                screen.getByText("Set Rose").click();
            });

            expect(systemConfigService.set).toHaveBeenCalledWith(
                "theme.mode",
                "dark"
            );
            expect(systemConfigService.set).toHaveBeenCalledWith(
                "theme.primary",
                "rose"
            );
        });

        it("DOES NOT save settings to backend when unauthenticated", () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: false });

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            act(() => {
                screen.getByText("Set Dark").click();
            });

            expect(systemConfigService.set).not.toHaveBeenCalled();
        });

        it("loads settings from backend on mount when authenticated", async () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: true });
            (systemConfigService.getAll as any).mockResolvedValue({
                "theme.mode": "dark",
                "theme.primary": "rose",
                "theme.radius": "0.75",
                "privacy.defaultMode": "true",
            });

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId("theme-value")).toHaveTextContent(
                    "dark"
                );
                expect(screen.getByTestId("color-value")).toHaveTextContent(
                    "rose"
                );
                expect(screen.getByTestId("radius-value")).toHaveTextContent(
                    "0.75"
                );
                expect(screen.getByTestId("privacy-value")).toHaveTextContent(
                    "true"
                );
            });
        });

        it("forces zinc primary color when unauthenticated", () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: false });

            // Simulate local storage having a different preference
            localStorageMock.getItem.mockImplementation((key) => {
                if (key === "vite-ui-theme-primary") return "rose";
                return null;
            });

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            // Should reset to zinc because not auth
            expect(screen.getByTestId("color-value")).toHaveTextContent("zinc");
        });
    });
});
