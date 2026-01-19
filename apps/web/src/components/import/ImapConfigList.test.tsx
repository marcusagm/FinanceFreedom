// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { type ImapConfig, ImapConfigList } from "./ImapConfigList";

const mockConfigs: ImapConfig[] = [
    {
        id: "1",
        host: "imap.test.com",
        port: 993,
        // secure: true, // properties changed in ImapConfig interface? Checks verify
        email: "test@test.com",
        folder: "INBOX",
        // accountId: "acc1",
        // hasPassword: true,
    },
    {
        id: "2",
        host: "imap.other.com",
        port: 993,
        // secure: true,
        email: "other@test.com",
        folder: "Bills",
        sender: "bills@vendor.com",
        // accountId: "acc1",
        // hasPassword: true,
    },
];

describe("ImapConfigList", () => {
    it("should render configurations", () => {
        render(
            <ImapConfigList
                configs={mockConfigs}
                onEdit={() => {}}
                onDelete={() => {}}
            />,
        );

        expect(screen.getByText("test@test.com")).toBeInTheDocument();
        expect(screen.getByText("other@test.com")).toBeInTheDocument();
        expect(screen.getByText("INBOX")).toBeInTheDocument();
        expect(screen.getByText("Bills")).toBeInTheDocument();
        expect(screen.getByText("imap.list.from")).toBeInTheDocument();
        expect(screen.getByText("bills@vendor.com")).toBeInTheDocument();
    });

    it("should call onEdit when edit button is clicked", async () => {
        const onEdit = vi.fn();
        const user = userEvent.setup();
        render(
            <ImapConfigList
                configs={mockConfigs}
                onEdit={onEdit}
                onDelete={() => {}}
            />,
        );

        const editButtons = screen.getAllByRole("button", {
            name: "common.edit",
        });
        await user.click(editButtons[0]);
        expect(onEdit).toHaveBeenCalledWith(mockConfigs[0]);
    });

    it("should call onDelete when delete button is clicked", async () => {
        const onDelete = vi.fn();
        const user = userEvent.setup();
        render(
            <ImapConfigList
                configs={mockConfigs}
                onEdit={() => {}}
                onDelete={onDelete}
            />,
        );

        const deleteButtons = screen.getAllByRole("button", {
            name: "common.delete",
        });
        await user.click(deleteButtons[0]);
        expect(onDelete).toHaveBeenCalledWith("1");
    });

    it("should verify empty state", () => {
        render(
            <ImapConfigList
                configs={[]}
                onEdit={() => {}}
                onDelete={() => {}}
            />,
        );
        expect(screen.getByText("imap.list.noConfigTitle")).toBeInTheDocument();
        expect(screen.getByText("imap.list.noConfigDesc")).toBeInTheDocument();
    });
});
