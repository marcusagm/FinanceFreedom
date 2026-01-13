import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";
import { ResetPassword } from "./ResetPassword";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { api } from "../lib/api";

vi.mock("../lib/api", () => ({
    api: {
        post: vi.fn(),
    },
}));

vi.mock("../lib/notification", () => ({
    notify: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const mockedApiPost = api.post as unknown as ReturnType<typeof vi.fn>;

describe("ResetPassword Component", () => {
    const renderComponent = (token = "valid-token") => {
        return render(
            <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
                <Routes>
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );
    };

    it("renders form when token present", () => {
        renderComponent();
        expect(
            screen.getByRole("heading", { name: "Redefinir Senha" })
        ).toBeInTheDocument();
        expect(screen.getByLabelText("Nova Senha")).toBeInTheDocument();
        expect(screen.getByLabelText("Confirmar Senha")).toBeInTheDocument();
    });

    it("shows invalid token message when token missing", () => {
        renderComponent(""); // Empty token
        expect(screen.getByText("Link Inválido")).toBeInTheDocument();
        expect(
            screen.getByText("O token de redefinição de senha está ausente.")
        ).toBeInTheDocument();
    });

    it("validates password mismatch", async () => {
        renderComponent();
        fireEvent.change(screen.getByLabelText("Nova Senha"), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByLabelText("Confirmar Senha"), {
            target: { value: "mismatch" },
        });
        fireEvent.click(
            screen.getByRole("button", { name: "Redefinir Senha" })
        );

        await waitFor(() => {
            expect(
                screen.getByText("As senhas não coincidem")
            ).toBeInTheDocument();
        });
    });

    it("handles success flow", async () => {
        renderComponent();
        mockedApiPost.mockResolvedValueOnce({});

        fireEvent.change(screen.getByLabelText("Nova Senha"), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByLabelText("Confirmar Senha"), {
            target: { value: "password123" },
        });
        fireEvent.click(
            screen.getByRole("button", { name: "Redefinir Senha" })
        );

        await waitFor(() => {
            expect(mockedApiPost).toHaveBeenCalledWith("/auth/reset-password", {
                token: "valid-token",
                newPassword: "password123",
            });
            expect(screen.getByText("Login Page")).toBeInTheDocument();
        });
    });

    it("handles error flow", async () => {
        renderComponent();
        mockedApiPost.mockRejectedValueOnce({
            response: { data: { message: "Token expired" } },
        });

        fireEvent.change(screen.getByLabelText("Nova Senha"), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByLabelText("Confirmar Senha"), {
            target: { value: "password123" },
        });
        fireEvent.click(
            screen.getByRole("button", { name: "Redefinir Senha" })
        );

        await waitFor(() => {
            expect(screen.getByText("Token expired")).toBeInTheDocument();
        });
    });
});
