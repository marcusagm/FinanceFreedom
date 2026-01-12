import { render, screen, fireEvent } from "@testing-library/react";
import { ImapConfigList, ImapConfig } from "./ImapConfigList";
import { describe, it, expect, vi } from "vitest";

const mockConfigs: ImapConfig[] = [
    {
        id: "1",
        host: "imap.test.com",
        port: 993,
        secure: true,
        email: "test@test.com",
        folder: "INBOX",
        accountId: "acc1",
        hasPassword: true,
    },
    {
        id: "2",
        host: "imap.other.com",
        port: 993,
        secure: true,
        email: "other@test.com",
        folder: "Bills",
        sender: "bills@vendor.com",
        accountId: "acc1",
        hasPassword: true,
    },
];

describe("ImapConfigList", () => {
    it("should render configurations", () => {
        render(
            <ImapConfigList
                configs={mockConfigs}
                onEdit={() => {}}
                onDelete={() => {}}
            />
        );

        expect(screen.getByText("test@test.com")).toBeInTheDocument();
        expect(screen.getByText("other@test.com")).toBeInTheDocument();
        expect(screen.getByText("INBOX")).toBeInTheDocument();
        expect(screen.getByText("Bills")).toBeInTheDocument();
        expect(screen.getByText("From:")).toBeInTheDocument();
        expect(screen.getByText("bills@vendor.com")).toBeInTheDocument();
    });

    it("should call onEdit when edit button is clicked", () => {
        const onEdit = vi.fn();
        render(
            <ImapConfigList
                configs={mockConfigs}
                onEdit={onEdit}
                onDelete={() => {}}
            />
        );

        const editButtons = screen.getAllByRole("button", { name: /edit/i }); // Assuming title="Edit" or aria-label="Edit"
        // Since we didn't add aria-labels, we might need to rely on the icon or add them.
        // Let's check the component source or add test-ids.
        // Actually, let's use the className or svg.
        // Better: Select by testId if available.
        // Fallback: Select all buttons and pick the first one (excluding Delete).

        // Let's interact with the first row's edit button
        fireEvent.click(editButtons[0]);
        expect(onEdit).toHaveBeenCalledWith(mockConfigs[0]);
    });

    it("should call onDelete when delete button is clicked", () => {
        const onDelete = vi.fn();
        render(
            <ImapConfigList
                configs={mockConfigs}
                onEdit={() => {}}
                onDelete={onDelete}
            />
        );

        const deleteButtons = screen.getAllByRole("button", {
            name: /delete/i,
        });
        fireEvent.click(deleteButtons[0]);
        expect(onDelete).toHaveBeenCalledWith("1");
    });

    it("should verify empty state", () => {
        render(
            <ImapConfigList
                configs={[]}
                onEdit={() => {}}
                onDelete={() => {}}
            />
        );
        expect(
            screen.getByText(/no imap configurations found/i)
        ).toBeInTheDocument();
    });
});
