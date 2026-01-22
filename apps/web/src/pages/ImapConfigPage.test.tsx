// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ImapConfigPage } from "./ImapConfigPage";
import { api } from "../lib/api";
import { BrowserRouter } from "react-router-dom";

// Mock API
vi.mock("../lib/api");

// Mock ImapConfigForm
vi.mock("../components/import/ImapConfigForm", () => ({
    ImapConfigForm: ({ isOpen, initialData }: any) => {
        if (!isOpen) return null;
        return (
            <div>
                {initialData ? "imap.form.titleEdit" : "imap.form.titleNew"}
                {initialData?.email && (
                    <input readOnly defaultValue={initialData.email} />
                )}
            </div>
        );
    },
}));

const mockAccounts = [{ id: "acc1", name: "Bank Account", type: "BANK" }];

const mockConfigs = [
    {
        id: "cfg1",
        accountId: "acc1",
        email: "user@test.com",
        host: "imap.test.com",
        folder: "INBOX",
    },
];

describe("ImapConfigPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (api.get as any).mockImplementation((url: string) => {
            if (url === "/accounts") {
                return Promise.resolve({ data: mockAccounts });
            }
            if (url.includes("/import/imap-configs")) {
                return Promise.resolve({ data: mockConfigs });
            }
            return Promise.resolve({ data: [] });
        });
        (api.post as any).mockResolvedValue({ data: { success: true } });
    });

    const renderPage = () => {
        render(
            <BrowserRouter>
                <ImapConfigPage />
            </BrowserRouter>,
        );
    };

    it("should render page title and load accounts", async () => {
        renderPage();

        // Expect title (key or translated)
        expect(screen.getByText("imap.list.title")).toBeInTheDocument();

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/accounts");
        });
    });

    it("should load configs when account is selected", async () => {
        renderPage();

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(
                expect.stringContaining("/import/imap-configs"),
            );
        });

        expect(screen.getByText("user@test.com")).toBeInTheDocument();
        expect(screen.getByText("INBOX")).toBeInTheDocument();
    });

    it("should open form when add button is clicked", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByText("imap.list.addConfig")).toBeInTheDocument(),
        );

        const addBtn = screen
            .getByText("imap.list.addConfig")
            .closest("button");
        await waitFor(() => expect(addBtn).not.toBeDisabled());

        fireEvent.click(addBtn!);

        expect(screen.getByText("imap.form.titleNew")).toBeInTheDocument();
    });

    it("should open form with data when edit button is clicked", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByText("user@test.com")).toBeInTheDocument(),
        );

        // Wait for accounts load which enables actions? No, list actions are independent of account selection usually?
        // Actually loadConfigs depends on selectedAccount.
        // So we implicitly waited for configs to load (user@test.com present).

        const editBtns = screen.getAllByLabelText("common.edit");
        fireEvent.click(editBtns[0]);

        expect(screen.getByText("imap.form.titleEdit")).toBeInTheDocument();
        expect(screen.getByDisplayValue("user@test.com")).toBeInTheDocument();
    });

    it("should call delete API when delete button is clicked and confirmed", async () => {
        // Mock window.confirm
        vi.spyOn(window, "confirm").mockImplementation(() => true);

        renderPage();
        await waitFor(() =>
            expect(screen.getByText("user@test.com")).toBeInTheDocument(),
        );

        const deleteBtns = screen.getAllByLabelText("common.delete");
        fireEvent.click(deleteBtns[0]);

        expect(window.confirm).toHaveBeenCalled();

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                "/import/imap-config/delete",
                { id: "cfg1" },
            );
        });
    });
});
