import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./DropdownMenu";

// Local stateful mock for DropdownMenu
vi.mock("./DropdownMenu", () => {
    const MockDropdown = ({ children }: any) => {
        const [open, setOpen] = React.useState(false);
        return (
            <div onClick={() => setOpen(!open)}>
                {React.Children.map(children, (child) => {
                    if (child.type.displayName === "DropdownMenuContent") {
                        return open ? child : null;
                    }
                    return child;
                })}
            </div>
        );
    };

    const MockTrigger = ({ children }: any) => <div>{children}</div>;
    MockTrigger.displayName = "DropdownMenuTrigger";

    const MockContent = ({ children }: any) => <div>{children}</div>;
    MockContent.displayName = "DropdownMenuContent";

    return {
        DropdownMenu: MockDropdown,
        DropdownMenuTrigger: MockTrigger,
        DropdownMenuContent: MockContent,
        DropdownMenuItem: ({ children, onClick }: any) => <div onClick={onClick}>{children}</div>,
    };
});

describe("DropdownMenu", () => {
    it("opens and shows items", async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                    <DropdownMenuItem>Item 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );

        expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
        const trigger = screen.getByText("Open Menu");
        await user.click(trigger);

        expect(await screen.findByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
    });
});
