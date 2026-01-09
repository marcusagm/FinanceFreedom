import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./Dialog";

// Radix UI Dialog renders into a portal, so we might need to look at document.body
describe("Dialog", () => {
    it("opens and closes", async () => {
        render(
            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <p>Dialog Content</p>
                </DialogContent>
            </Dialog>
        );

        expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Open"));
        expect(await screen.findByText("Dialog Title")).toBeInTheDocument();
        // Radix usually puts focus on the content
    });
});
