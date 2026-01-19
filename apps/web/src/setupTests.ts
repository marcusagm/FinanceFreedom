import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";

// expect.extend is automatically handled by the vitest import in newer versions
// if not, we can re-add it, but usually the side-effect import is enough.

afterEach(() => {
    cleanup();
});

// Global Mocks
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

window.PointerEvent = class PointerEvent extends Event {
    height: number;
    isPrimary: boolean;
    pointerId: number;
    pointerType: string;
    pressure: number;
    tangentialPressure: number;
    tiltX: number;
    tiltY: number;
    twist: number;
    width: number;

    constructor(type: string, params: PointerEventInit = {}) {
        super(type, params);
        this.pointerId = params.pointerId || 0;
        this.width = params.width || 0;
        this.height = params.height || 0;
        this.pressure = params.pressure || 0;
        this.tangentialPressure = params.tangentialPressure || 0;
        this.tiltX = params.tiltX || 0;
        this.tiltY = params.tiltY || 0;
        this.twist = params.twist || 0;
        this.pointerType = params.pointerType || "";
        this.isPrimary = params.isPrimary || false;
    }
} as any;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

// Mock PrivacyContext globally to avoid wrapping every test
vi.mock("@/contexts/PrivacyContext", async (importOriginal) => {
    const actual: any = await importOriginal();
    return {
        ...actual,
        usePrivacy: () => ({
            isObfuscated: false,
            toggleObfuscation: vi.fn(),
        }),
        PrivacyProvider: ({ children }: { children: React.ReactNode }) =>
            children,
    };
});

// Mock Dialog globally - Use a simplified version that doesn't use portals
vi.mock("@/components/ui/Dialog", () => ({
    Dialog: ({ open, children }: any) =>
        open
            ? React.createElement(
                  "div",
                  { "data-testid": "dialog-root" },
                  children,
              )
            : null,
    DialogContent: ({ children, className }: any) =>
        React.createElement(
            "div",
            { role: "dialog", className, "data-testid": "dialog-content" },
            children,
        ),
    DialogHeader: ({ children }: any) =>
        React.createElement("div", null, children),
    DialogBody: ({ children, className }: any) =>
        React.createElement("div", { className }, children),
    DialogTitle: ({ children }: any) =>
        React.createElement("div", null, children),
    DialogDescription: ({ children }: any) =>
        React.createElement("div", null, children),
    DialogFooter: ({ children }: any) =>
        React.createElement("div", null, children),
    DialogTrigger: ({ children }: any) =>
        React.createElement("div", null, children),
}));

// Mock DropdownMenu globally - simpler version
vi.mock("@/components/ui/DropdownMenu", () => {
    return {
        DropdownMenu: ({ children }: any) =>
            React.createElement(
                "div",
                { "data-testid": "dropdown-root" },
                children,
            ),
        DropdownMenuTrigger: ({ children }: any) =>
            React.createElement(
                "div",
                { "data-testid": "dropdown-trigger" },
                children,
            ),
        DropdownMenuContent: ({ children }: any) =>
            React.createElement(
                "div",
                { "data-testid": "dropdown-content" },
                children,
            ),
        DropdownMenuItem: ({ children, onClick }: any) =>
            React.createElement(
                "div",
                { onClick, "data-testid": "dropdown-item" },
                children,
            ),
        DropdownMenuLabel: ({ children }: any) =>
            React.createElement("div", null, children),
        DropdownMenuSeparator: () => React.createElement("hr"),
        DropdownMenuGroup: ({ children }: any) =>
            React.createElement("div", null, children),
        DropdownMenuPortal: ({ children }: any) =>
            React.createElement(React.Fragment, null, children),
        DropdownMenuSub: ({ children }: any) =>
            React.createElement("div", null, children),
        DropdownMenuSubContent: ({ children }: any) =>
            React.createElement("div", null, children),
        DropdownMenuSubTrigger: ({ children }: any) =>
            React.createElement("div", null, children),
        DropdownMenuRadioGroup: ({ children }: any) =>
            React.createElement("div", null, children),
        DropdownMenuCheckboxItem: ({ children }: any) =>
            React.createElement("div", null, children),
        DropdownMenuRadioItem: ({ children }: any) =>
            React.createElement("div", null, children),
        DropdownMenuShortcut: ({ children }: any) =>
            React.createElement("span", null, children),
    };
});

// Mock Radix UI Portals to render in place
vi.mock("@radix-ui/react-portal", () => ({
    Portal: ({ children }: any) =>
        React.createElement(React.Fragment, null, children),
    Root: ({ children }: any) =>
        React.createElement(React.Fragment, null, children),
}));

// Mock react-i18next
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: () => new Promise(() => {}),
        },
    }),
    Trans: ({ i18nKey, children }: any) => {
        return React.createElement(React.Fragment, null, i18nKey || children);
    },
    initReactI18next: {
        type: "3rdParty",
        init: () => {},
    },
}));
