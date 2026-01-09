import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "./DropdownMenu";

describe("DropdownMenu", () => {
    it("opens and shows items", async () => {
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
        fireEvent.click(screen.getByText("Open Menu"));
        // Radix uses portals, but usually works with testing-library's screen queries
        expect(await screen.findByText("Item 1")).toBeInTheDocument();
    });
});
