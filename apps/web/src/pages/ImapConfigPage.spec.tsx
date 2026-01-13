import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

// Mock ImapConfigForm to simplify page testing
vi.mock("../components/import/ImapConfigForm", () => ({
    ImapConfigForm: ({ isOpen, initialData, onSubmit, onTest }: any) =>
        isOpen ? (
            <div data-testid="imap-config-form">
                <label htmlFor="host">Host (IMAP)</label>
                <input
                    id="host"
                    defaultValue={initialData?.host || "imap.gmail.com"}
                    aria-label="Host (IMAP)"
                    onChange={() => {}}
                />
                <button onClick={() => onSubmit(initialData)}>
                    Save Config
                </button>
                <button onClick={() => onTest(initialData)}>
                    Test Connection
                </button>
                <button onClick={() => {}}>Close</button>
            </div>
        ) : null,
}));

// Remove Dialog mock as it is no longer needed
// vi.mock("../components/ui/Dialog", ...); removed

import { PrivacyProvider } from "@/contexts/PrivacyContext";

// Helper to render with Router and Providers
const renderWithRouter = (ui: React.ReactElement) => {
    return render(
        <PrivacyProvider>
            <BrowserRouter>{ui}</BrowserRouter>
        </PrivacyProvider>
    );
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
            if (url.includes("/import/imap-configs")) {
                return Promise.resolve({
                    data: [
                        {
                            id: "1",
                            accountId: "acc1",
                            host: "imap.test.com",
                            port: 993,
                            secure: true,
                            email: "test@test.com",
                            hasPassword: true,
                        },
                    ],
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

        // Should fetch config for acc1 (default) and display in list
        await waitFor(() => {
            expect(screen.getByText("test@test.com")).toBeInTheDocument();
            expect(screen.getByText("imap.test.com")).toBeInTheDocument(); // Host is probably not shown, check what IS shown.
        });

        // Host isn't shown in list, email is.
        expect(screen.getByText("test@test.com")).toBeInTheDocument();
    });

    it("saves configuration", async () => {
        (api.post as any).mockResolvedValue({ data: {} });

        renderWithRouter(<ImapConfigPage />);

        await waitFor(() => {
            expect(screen.getByText("test@test.com")).toBeInTheDocument();
        });

        const user = userEvent.setup();
        const editBtns = screen.getAllByLabelText("Edit");
        await user.click(editBtns[0]);

        await waitFor(() => {
            const input = screen.getByLabelText("Host (IMAP)");
            expect(input).toHaveValue("imap.test.com");
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
            expect(screen.getByText("test@test.com")).toBeInTheDocument();
        });

        const user = userEvent.setup();
        const editBtns = screen.getAllByLabelText("Edit");
        await user.click(editBtns[0]);

        await waitFor(() => {
            const input = screen.getByLabelText("Host (IMAP)");
            expect(input).toHaveValue("imap.test.com");
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
            expect(screen.getByText("test@test.com")).toBeInTheDocument()
        );

        const user = userEvent.setup();
        const editBtns = screen.getAllByLabelText("Edit");
        await user.click(editBtns[0]);

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
            expect(screen.getByText("test@test.com")).toBeInTheDocument()
        );

        const user = userEvent.setup();
        const editBtns = screen.getAllByLabelText("Edit");
        await user.click(editBtns[0]);

        await waitFor(() =>
            expect(
                screen.getByDisplayValue("imap.test.com")
            ).toBeInTheDocument()
        );

        const testBtn = screen.getByText("Test Connection");
        fireEvent.click(testBtn);

        await waitFor(() => {
            expect(screen.getByText("Erro")).toBeInTheDocument();
            expect(screen.getByText("Auth failed")).toBeInTheDocument();
        });
    });

    it("handles test connection exception", async () => {
        (api.post as any).mockRejectedValue(new Error("Network error"));

        renderWithRouter(<ImapConfigPage />);
        await waitFor(() =>
            expect(screen.getByText("test@test.com")).toBeInTheDocument()
        );

        const user = userEvent.setup();
        const editBtns = screen.getAllByLabelText("Edit");
        await user.click(editBtns[0]);

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

        const syncBtn = screen.getByText("Sync All");
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

        const syncBtn = screen.getByText("Sync All");
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
