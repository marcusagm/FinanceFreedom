import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
    it("renders input element", () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    });

    it("renders with label", () => {
        render(<Input label="Username" />);
        expect(screen.getByText("Username")).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toBeInTheDocument(); // input types default to textbox role usually? but standard input
        // Since we didn't specify type, it's text.
    });

    it("handles standard text input", () => {
        const handleChange = vi.fn();
        render(<Input onChange={handleChange} />);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "Hello" } });
        expect(handleChange).toHaveBeenCalled();
        expect(input).toHaveValue("Hello");
    });

    it("renders as currency input when currency prop is true", () => {
        render(<Input currency placeholder="R$ 0,00" />);
        // React-number-format usually renders an input
        const input = screen.getByPlaceholderText("R$ 0,00");
        expect(input).toBeInTheDocument();
    });

    // Note: detailed currency formatting tests depend on react-number-format behavior,
    // we assume the library works, primarily testing integration here.

    it("forwards ref", () => {
        const ref = { current: null };
        render(<Input ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("merges custom classes", () => {
        render(<Input className="custom-class" />);
        // Current implementation wraps label and input in div if label is present.
        // If no label, it returns input directly.
        expect(screen.getByRole("textbox")).toHaveClass("custom-class");
    });
});
