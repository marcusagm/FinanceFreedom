// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
    it("renders with default props", () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole("button", { name: "Click me" });
        expect(button).toBeInTheDocument();
        // Check for common Tailwind classes instead of BEM
        expect(button).toHaveClass("bg-primary");
    });

    it("renders with different variants", () => {
        const { rerender } = render(
            <Button variant="secondary">Secondary</Button>
        );
        expect(screen.getByRole("button")).toHaveClass("bg-secondary");

        rerender(<Button variant="destructive">Destructive</Button>);
        expect(screen.getByRole("button")).toHaveClass("bg-destructive");

        rerender(<Button variant="outline">Outline</Button>);
        expect(screen.getByRole("button")).toHaveClass("border-input");

        rerender(<Button variant="ghost">Ghost</Button>);
        expect(screen.getByRole("button")).toHaveClass("hover:bg-accent");
    });

    it("renders with different sizes", () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole("button")).toHaveClass("h-9");

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole("button")).toHaveClass("h-11");

        rerender(<Button size="icon">Icon</Button>);
        expect(screen.getByRole("button")).toHaveClass("h-10", "w-10");
    });

    it("handles click events", () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("forwards ref", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Button ref={ref}>Ref Button</Button>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("merges custom classes", () => {
        render(<Button className="custom-class">Custom</Button>);
        expect(screen.getByRole("button")).toHaveClass("custom-class");
    });
});
