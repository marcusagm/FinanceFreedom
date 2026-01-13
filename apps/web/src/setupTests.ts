import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";

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

// Mock Dialog globally
vi.mock("@/components/ui/Dialog", () => ({
    Dialog: ({ open, children }: any) =>
        open ? React.createElement("div", null, children) : null,
    DialogContent: ({ children }: any) =>
        React.createElement("div", { role: "dialog" }, children),
    DialogHeader: ({ children }: any) =>
        React.createElement("div", null, children),
    DialogTitle: ({ children }: any) =>
        React.createElement("div", null, children),
    DialogDescription: ({ children }: any) =>
        React.createElement("div", null, children),
    DialogFooter: ({ children }: any) =>
        React.createElement("div", null, children),
    DialogTrigger: ({ children }: any) =>
        React.createElement("div", null, children),
}));
