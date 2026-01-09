import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MoneyDisplay } from "./MoneyDisplay";
import { PrivacyProvider } from "../../contexts/PrivacyContext";
import * as PrivacyContextModule from "../../contexts/PrivacyContext";

// Mock the usage of usePrivacy to control state in tests without full provider logic if needed,
// but using the real provider is better for integration testing.
// However, to easily test both states, we can just wrap with the provider and manipulate it
// or mock the hook return value. Mocking hook is easier for component test.

describe("MoneyDisplay", () => {
    it("should display formatted money when not obfuscated", () => {
        vi.spyOn(PrivacyContextModule, "usePrivacy").mockReturnValue({
            isObfuscated: false,
            toggleObfuscation: vi.fn(),
        });

        render(<MoneyDisplay value={100} />);

        // \xa0 is non-breaking space used by Intl
        expect(screen.getByText(/R\$\s?100,00/)).toBeInTheDocument();
    });

    it("should display blur placeholder when obfuscated", () => {
        vi.spyOn(PrivacyContextModule, "usePrivacy").mockReturnValue({
            isObfuscated: true,
            toggleObfuscation: vi.fn(),
        });

        render(<MoneyDisplay value={100} />);

        const placeholder = screen.getByLabelText("Hidden value");
        expect(placeholder).toBeInTheDocument();
        expect(placeholder).toHaveTextContent("••••••");
        expect(placeholder).toHaveClass("blur-sm");
    });

    it("should accept custom currency", () => {
        vi.spyOn(PrivacyContextModule, "usePrivacy").mockReturnValue({
            isObfuscated: false,
            toggleObfuscation: vi.fn(),
        });

        render(<MoneyDisplay value={100} currency="USD" />);
        expect(screen.getByText(/US\$\s?100,00/)).toBeInTheDocument();
    });
});
