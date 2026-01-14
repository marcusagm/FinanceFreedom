import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { api } from "../lib/api";
import { ForgotPassword } from "./ForgotPassword";

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
            </BrowserRouter>,
        );
    };

    it("renders form", () => {
        renderComponent();
        expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("handles success flow", async () => {
        renderComponent();
        mockedApiPost.mockResolvedValueOnce({});

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "test@test.com" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Send Link" }));

        await waitFor(() => {
            expect(screen.getByText("Check your email")).toBeInTheDocument();
        });
    });

    it("handles error flow", async () => {
        renderComponent();
        mockedApiPost.mockRejectedValueOnce(new Error("Failed"));

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "test@test.com" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Send Link" }));

        await waitFor(() => {
            expect(screen.getByText("An error occurred. Please try again.")).toBeInTheDocument();
        });
    });
});
