import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { ThemeProvider } from "../providers/ThemeProvider";

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
        removeItem: vi.fn((key: string) => {
            delete store[key];
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
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock Themes Registry
vi.mock("../../registry/themes", () => ({
    themes: [
        {
            name: "zinc",
            label: "Padrão",
            activeColor: "hsl(240 5.9% 10%)",
            cssVars: {
                light: { "--primary": "zinc" },
                dark: { "--primary": "zinc" },
            },
        },
        {
            name: "emerald",
            label: "Emerald",
            activeColor: "hsl(142.1 76.2% 36.3%)",
            cssVars: {
                light: { "--primary": "emerald" },
                dark: { "--primary": "emerald" },
            },
        },
    ],
}));

// Mock SystemConfigService
vi.mock("../../services/system-config.service", () => ({
    systemConfigService: {
        getAll: vi.fn().mockResolvedValue({}),
        set: vi.fn().mockResolvedValue(true),
    },
}));

// Mock Auth to allow ThemeProvider to work
vi.mock("../../contexts/AuthContext", () => ({
    useAuth: () => ({ isAuthenticated: true }),
}));

describe("ThemeCustomizer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset localStorage
        window.localStorage.clear();
    });

    it("renders all theme options from registry", () => {
        render(
            <ThemeProvider defaultPrimaryColor="zinc">
                <ThemeCustomizer />
            </ThemeProvider>
        );

        // Check for theme labels or titles
        expect(screen.getByTitle("Padrão")).toBeInTheDocument();
        expect(screen.getByTitle("Emerald")).toBeInTheDocument();
    });

    it("highlights the active theme", () => {
        render(
            <ThemeProvider defaultPrimaryColor="emerald">
                <ThemeCustomizer />
            </ThemeProvider>
        );

        // Emerald button should have the ring class (indicating selection)
        // Access via title since we don't have better ID
        const emeraldBtn = screen.getByTitle("Emerald");
        expect(emeraldBtn.className).toContain("ring-primary");

        const zincBtn = screen.getByTitle("Padrão");
        expect(zincBtn.className).not.toContain("ring-primary");
    });

    it("changes theme when a color button is clicked", () => {
        render(
            <ThemeProvider defaultPrimaryColor="zinc">
                <ThemeCustomizer />
            </ThemeProvider>
        );

        const emeraldBtn = screen.getByTitle("Emerald");
        fireEvent.click(emeraldBtn);

        // After click, emerald should be active.
        // Force a re-render check (though React Testing Library handles this usually)
        expect(emeraldBtn.className).toContain("ring-primary");
    });

    it("renders mode toggle buttons", () => {
        render(
            <ThemeProvider>
                <ThemeCustomizer />
            </ThemeProvider>
        );

        expect(screen.getByText("Claro")).toBeInTheDocument();
        expect(screen.getByText("Escuro")).toBeInTheDocument();
        expect(screen.getByText("Sistema")).toBeInTheDocument();
    });

    it("renders privacy toggle", () => {
        render(
            <ThemeProvider>
                <ThemeCustomizer />
            </ThemeProvider>
        );

        expect(
            screen.getByText("Modo Privacidade (Padrão)")
        ).toBeInTheDocument();
        expect(screen.getByRole("switch")).toBeInTheDocument();
    });
});
