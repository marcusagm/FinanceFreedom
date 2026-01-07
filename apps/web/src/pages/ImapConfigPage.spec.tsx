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
});
