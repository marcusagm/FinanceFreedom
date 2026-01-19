// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImapConfigForm } from "./ImapConfigForm";

describe("ImapConfigForm", () => {
    const mockSubmit = vi.fn();
    const mockClose = vi.fn();
    const mockTest = vi.fn();

    const fillForm = () => {
        fireEvent.change(screen.getByLabelText("imap.form.hostLabel"), {
            target: { value: "imap.test.com" },
        });
        fireEvent.change(screen.getByLabelText("imap.form.portLabel"), {
            target: { value: "993" },
        });
        fireEvent.change(screen.getByLabelText("imap.form.emailLabel"), {
            target: { value: "test@test.com" },
        });
        fireEvent.change(screen.getByLabelText("imap.form.folderLabel"), {
            target: { value: "INBOX" },
        });
    };

    it("should render form fields", () => {
        render(
            <ImapConfigForm
                isOpen={true}
                onClose={mockClose}
                onSubmit={mockSubmit}
            />,
        );

        expect(
            screen.getByLabelText("imap.form.hostLabel"),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText("imap.form.portLabel"),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText("imap.form.emailLabel"),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText("imap.form.folderLabel"),
        ).toBeInTheDocument();
    });

    it("should call onSubmit with data", async () => {
        render(
            <ImapConfigForm
                isOpen={true}
                onClose={mockClose}
                onSubmit={mockSubmit}
            />,
        );

        fillForm();

        const submitBtn = screen.getByText("imap.form.saveButton");
        fireEvent.click(submitBtn);

        await waitFor(
            () => {
                expect(mockSubmit).toHaveBeenCalled();
            },
            { timeout: 3000 },
        );

        expect(mockSubmit.mock.calls[0][0]).toMatchObject({
            host: "imap.test.com",
            port: 993,
            email: "test@test.com",
            folder: "INBOX",
        });
    });

    it("should handle connection testing success", async () => {
        mockTest.mockResolvedValue({ success: true, message: "OK" });
        render(
            <ImapConfigForm
                isOpen={true}
                onClose={mockClose}
                onSubmit={mockSubmit}
                onTest={mockTest}
            />,
        );

        fillForm();

        const testBtn = screen.getByText("imap.form.testButton");
        fireEvent.click(testBtn);

        await waitFor(() => {
            expect(mockTest).toHaveBeenCalled();
            expect(screen.getByText("OK")).toBeInTheDocument();
        });
    });

    it("should handle connection testing failure", async () => {
        mockTest.mockResolvedValue({ success: false, message: "Fail" });
        render(
            <ImapConfigForm
                isOpen={true}
                onClose={mockClose}
                onSubmit={mockSubmit}
                onTest={mockTest}
            />,
        );

        fillForm();

        const testBtn = screen.getByText("imap.form.testButton");
        fireEvent.click(testBtn);

        await waitFor(() => {
            expect(screen.getByText("Fail")).toBeInTheDocument();
        });
    });
});
