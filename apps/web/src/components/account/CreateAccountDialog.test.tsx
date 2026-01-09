import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CreateAccountDialog } from "./CreateAccountDialog";
import { api } from "../../lib/api";

// Mock api
vi.mock("../../lib/api", () => ({
    api: {
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

describe("CreateAccountDialog", () => {
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
    };

    it("renders new account form", () => {
        render(<CreateAccountDialog {...mockProps} />);
        expect(screen.getByText("Nova Conta")).toBeInTheDocument();
        // Use generic text matcher or label
        expect(screen.getByText("Nome da Conta")).toBeInTheDocument();
    });

    it("submits new account", async () => {
        render(<CreateAccountDialog {...mockProps} />);

        // Use getByRole generic to find the input associated with the label "Nome da Conta"
        // In shadcn Form, the label is usually separate.
        // We can target by placeholder "Ex: Minha Carteira"
        const input = screen.getByPlaceholderText("Ex: Minha Carteira");
        fireEvent.change(input, { target: { value: "New Bank" } });

        fireEvent.click(screen.getByText("Criar Conta"));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
        });
        expect(mockProps.onSuccess).toHaveBeenCalled();
    });

    it("renders edit account form", () => {
        const account = {
            id: "1",
            name: "Existing",
            type: "WALLET",
            balance: 100,
            color: "#000000",
        };
        render(<CreateAccountDialog {...mockProps} accountToEdit={account} />);
        expect(screen.getByText("Editar Conta")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Existing")).toBeInTheDocument();
    });
});
