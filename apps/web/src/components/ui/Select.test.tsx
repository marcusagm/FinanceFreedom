import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

const options = [
    { value: "opt1", label: "Option 1" },
    { value: "opt2", label: "Option 2" },
];

describe("Select", () => {
    it("renders placeholder when no value", () => {
        render(<Select value="" onChange={() => {}} options={options} placeholder="Choose" />);
        expect(screen.getByText("Choose")).toBeInTheDocument();
    });

    it("renders selected label", () => {
        render(<Select value="opt1" onChange={() => {}} options={options} placeholder="Choose" />);
        expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("opens dropdown on click", () => {
        render(<Select value="" onChange={() => {}} options={options} placeholder="Choose" />);
        const trigger = screen.getByText("Choose");
        fireEvent.click(trigger);
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("calls onChange when option selected", () => {
        const handleChange = vi.fn();
        render(<Select value="" onChange={handleChange} options={options} placeholder="Choose" />);

        fireEvent.click(screen.getByText("Choose"));
        fireEvent.click(screen.getByText("Option 2"));

        expect(handleChange).toHaveBeenCalledWith("opt2");
    });

    it("closes dropdown when clicked outside", () => {
        render(
            <div>
                <span data-testid="outside">Outside</span>
                <Select value="" onChange={() => {}} options={options} placeholder="Choose" />
            </div>,
        );

        const trigger = screen.getByText("Choose");
        fireEvent.click(trigger);
        expect(screen.getByText("Option 1")).toBeVisible();

        fireEvent.mouseDown(screen.getByTestId("outside"));
        // Checking visibility might fail if css not loaded properly or jsdom limitation,
        // but component logic should remove it from DOM or hide it.
        // Current implementation uses conditional rendering for options?
        // Let's assume it removes from DOM.
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });
});
