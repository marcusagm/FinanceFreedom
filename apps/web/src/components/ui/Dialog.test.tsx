import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { vi } from "vitest";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./Dialog";

vi.unmock("@/components/ui/Dialog");

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
            </Dialog>,
        );

        expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Open"));
        expect(await screen.findByText("Dialog Title")).toBeInTheDocument();
        // Radix usually puts focus on the content
    });
});
