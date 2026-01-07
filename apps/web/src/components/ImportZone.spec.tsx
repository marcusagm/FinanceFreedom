import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ImportZone } from "./ImportZone";

describe("ImportZone", () => {
    it("renders dropzone instructions", () => {
        render(<ImportZone onFileSelect={() => {}} />);
        expect(
            screen.getByText(/Drag & drop an OFX file here/i)
        ).toBeInTheDocument();
    });

    // Better test: check disabled state
    it("renders disabled state", () => {
        render(<ImportZone onFileSelect={() => {}} disabled={true} />);
        expect(screen.getByTestId("import-zone-container")).toHaveClass(
            "opacity-50"
        );
    });
});
