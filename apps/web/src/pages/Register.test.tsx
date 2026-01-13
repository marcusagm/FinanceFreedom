import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";
import { Register } from "./Register";
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

describe("Register Component", () => {
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
                    <Register />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    it("renders register form", () => {
        renderComponent();
        expect(
            screen.getByRole("heading", { name: "Create Account" })
        ).toBeInTheDocument();
        expect(screen.getByTestId("name-input")).toBeInTheDocument();
        expect(screen.getByTestId("email-input")).toBeInTheDocument();
        expect(screen.getByTestId("password-input")).toBeInTheDocument();
        expect(
            screen.getByTestId("confirm-password-input")
        ).toBeInTheDocument();
    });

    it("validates password mismatch", async () => {
        renderComponent();
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByTestId("confirm-password-input"), {
            target: { value: "mismatch" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

        await waitFor(() => {
            expect(
                screen.getByText("Passwords do not match")
            ).toBeInTheDocument();
        });
    });

    it("handles successful registration", async () => {
        renderComponent();
        mockedApiPost.mockResolvedValueOnce({}); // Register
        mockedApiPost.mockResolvedValueOnce({
            data: { access_token: "token" },
        }); // Login
        mockedApiGet.mockResolvedValueOnce({ data: { id: "1", name: "User" } }); // Profile

        fireEvent.change(screen.getByTestId("name-input"), {
            target: { value: "User" },
        });
        fireEvent.change(screen.getByTestId("email-input"), {
            target: { value: "test@test.com" },
        });
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByTestId("confirm-password-input"), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

        await waitFor(() => {
            expect(mockedApiPost).toHaveBeenCalledWith(
                "/auth/register",
                expect.any(Object)
            );
            expect(mockedApiPost).toHaveBeenCalledWith(
                "/auth/login",
                expect.any(Object)
            );
            expect(loginMock).toHaveBeenCalled();
        });
    });
});
