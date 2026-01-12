import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImapConfigForm } from "./ImapConfigForm";
import { describe, it, expect, vi } from "vitest";

// Mock Dialog components since they rely on Radix UI which might need setup
vi.mock("../ui/Dialog", () => ({
    Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogHeader: ({ children }: any) => <div>{children}</div>,
    DialogTitle: ({ children }: any) => <div>{children}</div>,
    DialogDescription: ({ children }: any) => <div>{children}</div>,
}));

describe("ImapConfigForm", () => {
    const mockSubmit = vi.fn();
    const mockClose = vi.fn();
    const mockTest = vi.fn();

    it("should render form fields", () => {
        render(
            <ImapConfigForm
                isOpen={true}
                onClose={mockClose}
                onSubmit={mockSubmit}
            />
        );

        expect(screen.getByLabelText(/host/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/port/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/source folder/i)).toBeInTheDocument();
    });

    it("should validate required fields", async () => {
        render(
            <ImapConfigForm
                isOpen={true}
                onClose={mockClose}
                onSubmit={mockSubmit}
            />
        );

        const submitBtn = screen.getByRole("button", {
            name: /save configuration/i,
        });
        fireEvent.click(submitBtn);

        // Since we use native browser validation or react-hook-form default, we might not see error text unless configured.
        // Assuming standard implementation:
        await waitFor(() => {
            expect(mockSubmit).not.toHaveBeenCalled();
        });
    });

    it("should call onSubmit with data", async () => {
        render(
            <ImapConfigForm
                isOpen={true}
                onClose={mockClose}
                onSubmit={mockSubmit}
            />
        );

        fireEvent.change(screen.getByLabelText(/host/i), {
            target: { value: "imap.test.com" },
        });
        fireEvent.change(screen.getByLabelText(/port/i), {
            target: { value: "993" },
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@test.com" },
        });
        fireEvent.change(screen.getByLabelText(/source folder/i), {
            target: { value: "INBOX" },
        });

        const submitBtn = screen.getByRole("button", {
            name: /save configuration/i,
        });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    host: "imap.test.com",
                    email: "test@test.com",
                })
            );
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
            />
        );

        fireEvent.change(screen.getByLabelText(/host/i), {
            target: { value: "imap.test.com" },
        });
        fireEvent.change(screen.getByLabelText(/port/i), {
            target: { value: "993" },
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@test.com" },
        });
        fireEvent.change(screen.getByLabelText(/source folder/i), {
            target: { value: "INBOX" },
        });

        const testBtn = screen.getByRole("button", {
            name: /test connection/i,
        });
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
            />
        );

        fireEvent.change(screen.getByLabelText(/host/i), {
            target: { value: "imap.test.com" },
        });
        fireEvent.change(screen.getByLabelText(/port/i), {
            target: { value: "993" },
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@test.com" },
        });
        fireEvent.change(screen.getByLabelText(/source folder/i), {
            target: { value: "INBOX" },
        });

        const testBtn = screen.getByRole("button", {
            name: /test connection/i,
        });
        fireEvent.click(testBtn);

        await waitFor(() => {
            expect(screen.getByText("Fail")).toBeInTheDocument();
        });
    });
});
