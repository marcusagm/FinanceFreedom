import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Accounts } from "./Accounts";
import { api } from "../lib/api";
import { BrowserRouter } from "react-router-dom";

// Mock api
vi.mock("../lib/api", () => ({
    api: {
        get: vi.fn(),
        delete: vi.fn(),
    },
}));

// Mock Child Components to simplify page test
vi.mock("../components/account/AccountCard", () => ({
    AccountCard: ({ name, onEdit, onDelete }: any) => (
        <div data-testid="account-card">
            {name}
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
        </div>
    ),
}));

vi.mock("../components/account/CreateAccountDialog", () => ({
    CreateAccountDialog: ({ isOpen }: any) =>
        isOpen ? <div>CreateDialog</div> : null,
}));

vi.mock("../components/account/DeleteAccountDialog", () => ({
    DeleteAccountDialog: ({ isOpen, onConfirm }: any) =>
        isOpen ? (
            <div>
                DeleteDialog
                <button onClick={onConfirm}>ConfirmDelete</button>
            </div>
        ) : null,
}));

describe("Accounts Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (api.get as any).mockResolvedValue({ data: [] });
    });

    const renderPage = () =>
        render(
            <BrowserRouter>
                <Accounts />
            </BrowserRouter>
        );

    it("renders empty state", async () => {
        renderPage();
        expect(
            await screen.findByText(/nenhuma conta encontrada/i)
        ).toBeInTheDocument();
    });

    it("renders accounts list", async () => {
        (api.get as any).mockResolvedValue({
            data: [
                { id: "1", name: "Account 1", type: "WALLET", balance: 100 },
                { id: "2", name: "Account 2", type: "BANK", balance: 200 },
            ],
        });

        renderPage();

        expect(await screen.findByText("Account 1")).toBeInTheDocument();
        expect(screen.getByText("Account 2")).toBeInTheDocument();
    });

    it("opens create dialog", async () => {
        renderPage();
        fireEvent.click(screen.getByText("+ Nova Conta"));
        expect(screen.getByText("CreateDialog")).toBeInTheDocument();
    });

    it("opens delete dialog and confirms", async () => {
        (api.get as any).mockResolvedValue({
            data: [
                { id: "1", name: "Account 1", type: "WALLET", balance: 100 },
            ],
        });

        renderPage();
        const deleteBtn = await screen.findByText("Delete");
        fireEvent.click(deleteBtn);

        expect(screen.getByText("DeleteDialog")).toBeInTheDocument();

        fireEvent.click(screen.getByText("ConfirmDelete"));

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith("/accounts/1");
        });
    });
});
