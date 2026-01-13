import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";
import { Login } from "./Login";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../lib/api";

// Mock API
vi.mock("../lib/api", () => ({
    api: {
        post: vi.fn(),
        get: vi.fn(),
        defaults: {
            headers: {
                common: {},
            },
        },
    },
}));

// Mock API methods
const mockedApiPost = api.post as unknown as ReturnType<typeof vi.fn>;
const mockedApiGet = api.get as unknown as ReturnType<typeof vi.fn>;

describe("Login Component", () => {
    const loginMock = vi.fn();

    const renderComponent = () => {
        return render(
            <AuthContext.Provider
                value={{
                    isAuthenticated: false,
                    user: null,
                    token: null,
                    login: loginMock,
                    logout: vi.fn(),
                    isLoading: false,
                }}
            >
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    it("renders login form correctly", () => {
        renderComponent();
        expect(screen.getByText("Finance Freedom")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Senha")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Entrar" })
        ).toBeInTheDocument();
    });

    it("validates empty inputs", async () => {
        renderComponent();
        fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

        await waitFor(() => {
            expect(
                screen.getByText("Por favor, insira um e-mail válido")
            ).toBeInTheDocument();
            expect(
                screen.getByText("A senha é obrigatória")
            ).toBeInTheDocument();
        });
    });

    it("handles successful login", async () => {
        renderComponent();
        mockedApiPost.mockResolvedValueOnce({
            data: { access_token: "fake-token" },
        });
        mockedApiGet.mockResolvedValueOnce({
            data: { id: "1", name: "User" },
        });

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Senha"), {
            target: { value: "password" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

        await waitFor(() => {
            expect(mockedApiPost).toHaveBeenCalledWith("/auth/login", {
                email: "test@example.com",
                password: "password",
            });
            expect(loginMock).toHaveBeenCalledWith("fake-token", {
                id: "1",
                name: "User",
            });
        });
    });

    it("handles login failure", async () => {
        renderComponent();
        mockedApiPost.mockRejectedValueOnce(new Error("Invalid credentials"));

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Senha"), {
            target: { value: "wrong" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

        await waitFor(() => {
            expect(
                screen.getByText("Credenciais inválidas. Tente novamente.")
            ).toBeInTheDocument();
        });
    });
});
