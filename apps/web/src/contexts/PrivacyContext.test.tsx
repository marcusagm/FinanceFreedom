import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrivacyProvider, usePrivacy } from "./PrivacyContext";

vi.unmock("./PrivacyContext");
vi.unmock("@/contexts/PrivacyContext");

describe("PrivacyContext", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("should default to false", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <PrivacyProvider>{children}</PrivacyProvider>
        );
        const { result } = renderHook(() => usePrivacy(), { wrapper });
        expect(result.current.isObfuscated).toBe(false);
    });

    it("should toggle obfuscation", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <PrivacyProvider>{children}</PrivacyProvider>
        );
        const { result } = renderHook(() => usePrivacy(), { wrapper });

        act(() => {
            result.current.toggleObfuscation();
        });

        expect(result.current.isObfuscated).toBe(true);

        act(() => {
            result.current.toggleObfuscation();
        });

        expect(result.current.isObfuscated).toBe(false);
    });

    it("should persist state to localStorage", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <PrivacyProvider>{children}</PrivacyProvider>
        );
        const { result } = renderHook(() => usePrivacy(), { wrapper });

        act(() => {
            result.current.toggleObfuscation();
        });

        expect(localStorage.getItem("privacy_mode")).toBe("true");
    });

    it("should load state from localStorage", () => {
        localStorage.setItem("privacy_mode", "true");
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <PrivacyProvider>{children}</PrivacyProvider>
        );
        const { result } = renderHook(() => usePrivacy(), { wrapper });
        expect(result.current.isObfuscated).toBe(true);
    });
});
