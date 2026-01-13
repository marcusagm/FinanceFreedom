import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImapConfigForm } from "./ImapConfigForm";
import { describe, it, expect, vi } from "vitest";

describe("ImapConfigForm", () => {
    const mockSubmit = vi.fn();
    const mockClose = vi.fn();
    const mockTest = vi.fn();

    const fillForm = () => {
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
    };

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

    it("should call onSubmit with data", async () => {
        render(
            <ImapConfigForm
                isOpen={true}
                onClose={mockClose}
                onSubmit={mockSubmit}
            />
        );

        fillForm();

        const submitBtn = screen.getByText(/save configuration/i);
        fireEvent.click(submitBtn);

        await waitFor(
            () => {
                expect(mockSubmit).toHaveBeenCalled();
            },
            { timeout: 3000 }
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
            />
        );

        fillForm();

        const testBtn = screen.getByText(/test connection/i);
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

        fillForm();

        const testBtn = screen.getByText(/test connection/i);
        fireEvent.click(testBtn);

        await waitFor(() => {
            expect(screen.getByText("Fail")).toBeInTheDocument();
        });
    });
});
