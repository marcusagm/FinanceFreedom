import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { ColorInput } from "./ColorInput";

describe("ColorInput", () => {
    it("renders with label and initial value", () => {
        render(<ColorInput label="Color" value="#ff0000" onChange={() => {}} />);
        expect(screen.getByText("Color")).toBeInTheDocument();
        // Since there are two inputs (color and text) with the same value, we use getAll
        const inputs = screen.getAllByDisplayValue(/#FF0000/i);
        expect(inputs.length).toBeGreaterThan(0);
    });

    it("updates on input change", () => {
        const handleChange = vi.fn();
        render(<ColorInput value="#000000" onChange={handleChange} />);

        const input = screen.getByPlaceholderText("#000000");
        fireEvent.change(input, { target: { value: "#FFFFFF" } });

        fireEvent.blur(input);
        expect(handleChange).toHaveBeenCalledWith("#FFFFFF");
    });
});
