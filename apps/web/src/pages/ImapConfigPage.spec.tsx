import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ImapConfigPage } from "./ImapConfigPage";
import { api } from "../lib/api";
import { BrowserRouter } from "react-router-dom";

// Mock dependencies
vi.mock("../lib/api");
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Mock Modal to ensure footer renders
vi.mock("../components/ui/Modal", () => ({
    Modal: ({ isOpen, children, title, footer }: any) =>
        isOpen ? (
            <div role="dialog" aria-label={title}>
                <h2>{title}</h2>
                <div>{children}</div>
                <footer>{footer}</footer>
            </div>
        ) : null,
}));

// Helper to render with Router
const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ImapConfigPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock accounts
        (api.get as any).mockImplementation((url: string) => {
            if (url === "/accounts") {
                return Promise.resolve({
                    data: [{ id: "acc1", name: "Bank A", type: "CHECKING" }],
                });
            }
            if (url.includes("/import/imap-config")) {
                return Promise.resolve({
                    data: {
                        host: "imap.test.com",
                        port: 993,
                        secure: true,
                        email: "test@test.com",
                        hasPassword: true,
                    },
                });
            }
            return Promise.resolve({ data: {} });
        });
    });

    it("renders and loads configuration", async () => {
        renderWithRouter(<ImapConfigPage />);

        expect(screen.getByText("IMAP Configuration")).toBeInTheDocument();

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/accounts");
        });

        // Should fetch config for acc1 (default)
        await waitFor(() => {
            const hostInput = screen.getByPlaceholderText(
                "imap.gmail.com"
            ) as HTMLInputElement;
            expect(hostInput.value).toBe("imap.test.com");
        });
    });

    it("saves configuration", async () => {
        (api.post as any).mockResolvedValue({ data: {} });

        renderWithRouter(<ImapConfigPage />);

        await waitFor(() => {
            expect(
                screen.getByDisplayValue("imap.test.com")
            ).toBeInTheDocument();
        });

        const saveBtn = screen.getByText("Save Config");
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                "/import/imap-config",
                expect.objectContaining({
                    accountId: "acc1",
                    host: "imap.test.com",
                    port: 993,
                    email: "test@test.com",
                })
            );
            // Check for modal presence
            expect(screen.getByText("Success")).toBeInTheDocument();
            expect(
                screen.getByText("Configuration saved successfully!")
            ).toBeInTheDocument();
        });
    });

    it("tests connection", async () => {
        (api.post as any).mockResolvedValue({ data: { success: true } });

        renderWithRouter(<ImapConfigPage />);

        await waitFor(() => {
            expect(
                screen.getByDisplayValue("imap.test.com")
            ).toBeInTheDocument();
        });

        const testBtn = screen.getByText("Test Connection");
        fireEvent.click(testBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                "/import/imap-test",
                expect.objectContaining({
                    accountId: "acc1",
                })
            );
            expect(
                screen.getByText("Connection successful!")
            ).toBeInTheDocument();
        });
    });

    it("handles save error", async () => {
        (api.post as any).mockRejectedValue(new Error("Save failed"));

        renderWithRouter(<ImapConfigPage />);
        await waitFor(() =>
            expect(
                screen.getByDisplayValue("imap.test.com")
            ).toBeInTheDocument()
        );

        const saveBtn = screen.getByText("Save Config");
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(screen.getByText("Error")).toBeInTheDocument();
            expect(screen.getByText(/Failed to save/)).toBeInTheDocument();
        });

        // Close modal
        fireEvent.click(screen.getByText("Close"));
        await waitFor(() =>
            expect(screen.queryByText("Error")).not.toBeInTheDocument()
        );
    });

    it("handles test connection failure", async () => {
        (api.post as any).mockResolvedValue({
            data: { success: false, message: "Auth failed" },
        });

        renderWithRouter(<ImapConfigPage />);
        await waitFor(() =>
            expect(
                screen.getByDisplayValue("imap.test.com")
            ).toBeInTheDocument()
        );

        const testBtn = screen.getByText("Test Connection");
        fireEvent.click(testBtn);

        await waitFor(() => {
            expect(screen.getByText("Error")).toBeInTheDocument();
            expect(screen.getByText("Auth failed")).toBeInTheDocument();
        });
    });

    it("handles test connection exception", async () => {
        (api.post as any).mockRejectedValue(new Error("Network error"));

        renderWithRouter(<ImapConfigPage />);
        await waitFor(() =>
            expect(
                screen.getByDisplayValue("imap.test.com")
            ).toBeInTheDocument()
        );

        const testBtn = screen.getByText("Test Connection");
        fireEvent.click(testBtn);

        await waitFor(() => {
            expect(screen.getByText("Test failed")).toBeInTheDocument();
        });
    });

    it("starts manual sync flow", async () => {
        (api.post as any).mockImplementation((url: string) => {
            if (url === "/import/sync-now") {
                return Promise.resolve({ data: { imported: 5 } });
            }
            return Promise.resolve({ data: {} });
        });

        renderWithRouter(<ImapConfigPage />);
        await waitFor(() =>
            expect(screen.getByText("IMAP Configuration")).toBeInTheDocument()
        );

        const syncBtn = screen.getByText("Sync Now");
        fireEvent.click(syncBtn);

        // Confirm modal appears
        await waitFor(() => {
            expect(screen.getByText("Start Manual Sync")).toBeInTheDocument();
        });

        // Cancel
        fireEvent.click(screen.getByText("Cancel"));
        expect(screen.queryByText("Start Manual Sync")).not.toBeInTheDocument();

        // Retry and confirm
        fireEvent.click(syncBtn);
        await waitFor(() =>
            expect(screen.getByText("Start Manual Sync")).toBeInTheDocument()
        );

        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(screen.getByText("Sync Complete")).toBeInTheDocument();
            expect(
                screen.getByText(
                    "Successfully synced 5 transactions from email."
                )
            ).toBeInTheDocument();
        });
    });

    it("handles sync failure", async () => {
        (api.post as any).mockImplementation((url: string) => {
            if (url === "/import/sync-now") {
                return Promise.reject(new Error("Timeout"));
            }
            return Promise.resolve({ data: {} });
        });

        renderWithRouter(<ImapConfigPage />);
        await waitFor(() =>
            expect(screen.getByText("IMAP Configuration")).toBeInTheDocument()
        );

        const syncBtn = screen.getByText("Sync Now");
        fireEvent.click(syncBtn);

        await waitFor(() =>
            expect(screen.getByText("Start Manual Sync")).toBeInTheDocument()
        );
        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(screen.getByText("Sync Failed")).toBeInTheDocument();
            expect(screen.getByText("Timeout")).toBeInTheDocument();
        });
    });
});
