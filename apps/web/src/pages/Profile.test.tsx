import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";
import { Profile } from "./Profile";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { BrowserRouter } from "react-router-dom";

// Mock API
vi.mock("../lib/api", () => ({
    api: {
        put: vi.fn(),
    },
}));

vi.mock("../lib/notification", () => ({
    notify: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const mockedApiPut = api.put as unknown as ReturnType<typeof vi.fn>;

describe("Profile Component", () => {
    vi.setConfig({ testTimeout: 15000 }); // Increase timeout to 15s

    const loginMock = vi.fn();
    const mockUser = { id: "1", name: "User", email: "user@example.com" };

    const renderComponent = (user = mockUser) => {
        return render(
            <AuthContext.Provider
                value={{
                    isAuthenticated: true,
                    user: user,
                    token: "fake-token",
                    login: loginMock,
                    logout: vi.fn(),
                    isLoading: false,
                }}
            >
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    it("renders profile forms with user data", () => {
        renderComponent();
        expect(screen.getByTestId("profile-name-input")).toHaveValue("User");
        expect(screen.getByTestId("profile-email-input")).toHaveValue(
            "user@example.com"
        );
        expect(screen.getByText("Dados Pessoais")).toBeInTheDocument();
        expect(screen.getByText("Alterar Senha")).toBeInTheDocument();
    });

    it("updates profile info successfully", async () => {
        renderComponent();
        mockedApiPut.mockResolvedValueOnce({
            data: { ...mockUser, name: "New Name" },
        });

        fireEvent.change(screen.getByTestId("profile-name-input"), {
            target: { value: "New Name" },
        });
        fireEvent.click(
            screen.getByRole("button", { name: "Salvar Alterações" })
        );

        await waitFor(() => {
            expect(mockedApiPut).toHaveBeenCalledWith("/auth/profile", {
                name: "New Name",
                email: "user@example.com",
            });
            expect(loginMock).toHaveBeenCalled();
        });
    });

    it("validates password change mismatch", async () => {
        renderComponent();
        fireEvent.change(screen.getByTestId("current-password-input"), {
            target: { value: "old" },
        });
        fireEvent.change(screen.getByTestId("new-password-input"), {
            target: { value: "new123" },
        });
        fireEvent.change(screen.getByTestId("confirm-new-password-input"), {
            target: { value: "mismatch" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Alterar Senha" }));

        await waitFor(() => {
            expect(
                screen.getByText("As senhas não coincidem")
            ).toBeInTheDocument();
        });
    });

    it("updates password successfully", async () => {
        renderComponent();
        mockedApiPut.mockResolvedValueOnce({});

        fireEvent.change(screen.getByTestId("current-password-input"), {
            target: { value: "old" },
        });
        fireEvent.change(screen.getByTestId("new-password-input"), {
            target: { value: "new123" },
        });
        fireEvent.change(screen.getByTestId("confirm-new-password-input"), {
            target: { value: "new123" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Alterar Senha" }));

        await waitFor(() => {
            expect(mockedApiPut).toHaveBeenCalledWith("/auth/password", {
                currentPassword: "old",
                newPassword: "new123",
            });
        });
    });
});
