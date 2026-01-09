import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Transactions } from "./Transactions";
import { api } from "../lib/api";
import { BrowserRouter } from "react-router-dom";

// Mock api
vi.mock("../lib/api", () => ({
    api: {
        get: vi.fn(),
        delete: vi.fn(),
    },
}));

// Mock Children
vi.mock("../components/transactions/TransactionList", () => ({
    TransactionList: ({ transactions, onEdit, onDelete }: any) => (
        <div>
            {transactions.map((t: any) => (
                <div key={t.id} data-testid="tx-row">
                    {t.description}
                    <button onClick={() => onEdit(t)}>Edit</button>
                    <button onClick={() => onDelete(t.id)}>Delete</button>
                </div>
            ))}
        </div>
    ),
}));

vi.mock("../components/transactions/NewTransactionDialog", () => ({
    NewTransactionDialog: ({ isOpen }: any) =>
        isOpen ? <div>NewTxDialog</div> : null,
}));

vi.mock("../components/transactions/DeleteTransactionDialog", () => ({
    DeleteTransactionDialog: ({ isOpen, onConfirm }: any) =>
        isOpen ? (
            <div>
                DeleteTxDialog
                <button onClick={onConfirm}>ConfirmDelete</button>
            </div>
        ) : null,
}));

describe("Transactions Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (api.get as any).mockImplementation((url: string) => {
            if (url === "/transactions") return Promise.resolve({ data: [] });
            if (url === "/accounts") return Promise.resolve({ data: [] });
            return Promise.resolve({ data: [] });
        });
    });

    const renderPage = () =>
        render(
            <BrowserRouter>
                <Transactions />
            </BrowserRouter>
        );

    it("fetches and displays transactions", async () => {
        (api.get as any).mockImplementation((url: string) => {
            if (url === "/transactions")
                return Promise.resolve({
                    data: [
                        {
                            id: "1",
                            description: "Test Tx",
                            amount: 100,
                            account: { name: "Acc" },
                        },
                    ],
                });
            return Promise.resolve({ data: [] });
        });

        renderPage();
        expect(await screen.findByText("Test Tx")).toBeInTheDocument();
    });

    it("opens new transaction dialog", async () => {
        renderPage();
        await waitFor(() => screen.queryByText("Carregando...") === null);

        fireEvent.click(screen.getByText("Nova Transação"));
        expect(screen.getByText("NewTxDialog")).toBeInTheDocument();
    });

    it("deletes transaction", async () => {
        (api.get as any).mockImplementation((url: string) => {
            if (url === "/transactions")
                return Promise.resolve({
                    data: [
                        {
                            id: "1",
                            description: "Test Tx",
                            amount: 100,
                            account: { name: "Acc" },
                        },
                    ],
                });
            return Promise.resolve({ data: [] });
        });

        renderPage();
        const deleteBtn = await screen.findByText("Delete");
        fireEvent.click(deleteBtn);

        expect(screen.getByText("DeleteTxDialog")).toBeInTheDocument();
        fireEvent.click(screen.getByText("ConfirmDelete"));

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith("/transactions/1");
        });
    });
});
