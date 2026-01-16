import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch Component", () => {
    it("renders correctly", () => {
        render(<Switch aria-label="Toggle settings" />);
        expect(screen.getByRole("switch")).toBeInTheDocument();
        expect(screen.getByRole("switch")).toHaveAttribute(
            "aria-label",
            "Toggle settings"
        );
    });

    it("toggles state when clicked", () => {
        const handleCheckedChange = vi.fn();
        render(
            <Switch checked={false} onCheckedChange={handleCheckedChange} />
        );

        const switchEl = screen.getByRole("switch");
        expect(switchEl).toHaveAttribute("aria-checked", "false"); // Use string "false" as attribute value

        fireEvent.click(switchEl);
        expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });

    it("respects defaultChecked prop", () => {
        render(<Switch defaultChecked={true} />);
        expect(screen.getByRole("switch")).toHaveAttribute(
            "aria-checked",
            "true"
        );
    });

    it("can be disabled", () => {
        const handleCheckedChange = vi.fn();
        render(<Switch disabled onCheckedChange={handleCheckedChange} />);

        const switchEl = screen.getByRole("switch");
        expect(switchEl).toBeDisabled();

        fireEvent.click(switchEl);
        expect(handleCheckedChange).not.toHaveBeenCalled();
    });
});
