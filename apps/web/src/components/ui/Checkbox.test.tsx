import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
    it("renders successfully", () => {
        render(<Checkbox />);
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("displays checked state", () => {
        render(<Checkbox checked={true} />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveAttribute("aria-checked", "true");
        expect(checkbox).toHaveClass("bg-primary");
    });

    it("displays unchecked state", () => {
        render(<Checkbox checked={false} />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveAttribute("aria-checked", "false");
        expect(checkbox).not.toHaveClass("bg-primary");
    });

    it("calls onCheckedChange when clicked", () => {
        const handleChange = vi.fn();
        render(<Checkbox checked={false} onCheckedChange={handleChange} />);

        fireEvent.click(screen.getByRole("checkbox"));
        expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("does not call onCheckedChange when disabled", () => {
        const handleChange = vi.fn();
        render(<Checkbox disabled onCheckedChange={handleChange} />);

        fireEvent.click(screen.getByRole("checkbox"));
        expect(handleChange).not.toHaveBeenCalled();
        expect(screen.getByRole("checkbox")).toBeDisabled();
    });
});
