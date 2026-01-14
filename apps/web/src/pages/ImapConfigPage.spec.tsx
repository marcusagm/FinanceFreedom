import { PrivacyProvider } from "@/contexts/PrivacyContext";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as apiModule from "../lib/api";
import { ImapConfigPage } from "./ImapConfigPage";

const { api } = apiModule;

// Mock dependencies
vi.mock("../lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Mock Modal to ensure footer renders
vi.mock("../components/ui/Modal", () => ({
    Modal: ({ isOpen, children, title, footer, onClose }: any) =>
        isOpen ? (
            <div role="dialog" aria-label={title} data-testid="feedback-modal">
                <h2>{title}</h2>
                <div>{children}</div>
                <footer>{footer}</footer>
                <button onClick={onClose}>Close Overlay</button>
            </div>
        ) : null,
}));

// Mock ImapConfigForm to simplify page testing
vi.mock("../components/import/ImapConfigForm", () => ({
    ImapConfigForm: ({ isOpen, initialData, onSubmit, onTest }: any) => {
        const [testResult, setTestResult] = React.useState<string | null>(null);

        const handleLocalTest = async () => {
            const res = await onTest(initialData);
            setTestResult(res.message || (res.success ? "Connection successful!" : "Failed"));
        };

        return isOpen ? (
            <div data-testid="imap-config-form">
                <button onClick={() => onSubmit(initialData)}>Save Config</button>
                <button onClick={handleLocalTest}>Test Connection</button>
                {testResult && <div data-testid="test-result">{testResult}</div>}
            </div>
        ) : null;
    },
}));

// Helper to render with Router and Providers
const renderWithRouter = (ui: React.ReactElement) => {
    return render(
        <PrivacyProvider>
            <BrowserRouter>{ui}</BrowserRouter>
        </PrivacyProvider>,
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
        await waitFor(() => expect(screen.getByText("test@test.com")).toBeInTheDocument());
    });

    it("saves configuration", async () => {
        (api.post as any).mockResolvedValue({ data: {} });
        renderWithRouter(<ImapConfigPage />);

        await waitFor(() => expect(screen.getByLabelText("Edit")).toBeInTheDocument());
        fireEvent.click(screen.getByLabelText("Edit"));

        await waitFor(() => expect(screen.getByTestId("imap-config-form")).toBeInTheDocument());
        fireEvent.click(screen.getByText("Save Config"));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/import/imap-config", expect.anything());
            expect(screen.getByText("Success")).toBeInTheDocument();
        });
    });

    it("tests connection", async () => {
        (api.post as any).mockResolvedValue({ data: { success: true } });
        renderWithRouter(<ImapConfigPage />);

        await waitFor(() => expect(screen.getByLabelText("Edit")).toBeInTheDocument());
        fireEvent.click(screen.getByLabelText("Edit"));

        await waitFor(() => expect(screen.getByText("Test Connection")).toBeInTheDocument());
        fireEvent.click(screen.getByText("Test Connection"));

        await waitFor(() => {
            expect(screen.getByTestId("test-result")).toHaveTextContent("Connection successful!");
        });
    });

    it("handles sync success", async () => {
        (api.post as any).mockResolvedValue({ data: { imported: 5 } });
        renderWithRouter(<ImapConfigPage />);

        // Wait for button to be enabled
        const syncBtn = await screen.findByText("Sync All");
        await waitFor(() => expect(syncBtn).not.toBeDisabled());
        fireEvent.click(syncBtn);

        await waitFor(() => {
            expect(screen.getByText("Sync Complete")).toBeInTheDocument();
            expect(screen.getByText("Synced 5 transactions!")).toBeInTheDocument();
        });
    });

    it("handles sync failure", async () => {
        (api.post as any).mockRejectedValue({
            response: { data: { message: "Sync failed" } },
        });
        renderWithRouter(<ImapConfigPage />);

        const syncBtn = await screen.findByText("Sync All");
        await waitFor(() => expect(syncBtn).not.toBeDisabled());
        fireEvent.click(syncBtn);

        await waitFor(() => {
            expect(screen.getByText("Sync failed")).toBeInTheDocument();
        });
    });
});
