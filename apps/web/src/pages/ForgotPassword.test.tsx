import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi, expect } from "vitest";
import { ForgotPassword } from "./ForgotPassword";
import { BrowserRouter } from "react-router-dom";
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

describe("ForgotPassword Component", () => {
    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <ForgotPassword />
            </BrowserRouter>
        );
    };

    it("renders form", () => {
        renderComponent();
        expect(screen.getByText("Esqueceu a Senha?")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("handles success flow", async () => {
        renderComponent();
        mockedApiPost.mockResolvedValueOnce({});

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "test@test.com" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Enviar Link" }));

        await waitFor(() => {
            expect(
                screen.getByText("Verifique seu e-mail")
            ).toBeInTheDocument();
        });
    });

    it("handles error flow", async () => {
        renderComponent();
        mockedApiPost.mockRejectedValueOnce(new Error("Failed"));

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "test@test.com" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Enviar Link" }));

        await waitFor(() => {
            expect(
                screen.getByText("Ocorreu um erro. Tente novamente.")
            ).toBeInTheDocument();
        });
    });
});
