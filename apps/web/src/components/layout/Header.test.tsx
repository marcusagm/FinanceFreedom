import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "./Header";
import { MemoryRouter } from "react-router-dom";
import { PrivacyProvider } from "../../contexts/PrivacyContext";

// Mock ModeToggle
vi.mock("../ui/ModeToggle", () => ({
    ModeToggle: () => <div data-testid="mode-toggle">ModeToggle</div>,
}));

describe("Header", () => {
    it("renders successfully", () => {
        render(
            <MemoryRouter>
                <PrivacyProvider>
                    <Header />
                </PrivacyProvider>
            </MemoryRouter>
        );
        expect(screen.getByText("FinanceFreedom")).toBeInTheDocument();
        expect(screen.getByTestId("mode-toggle")).toBeInTheDocument();
    });

    it("highlights active link", () => {
        render(
            <MemoryRouter initialEntries={["/accounts"]}>
                <PrivacyProvider>
                    <Header />
                </PrivacyProvider>
            </MemoryRouter>
        );

        // Desktop nav check
        const accountsLink = screen.getByRole("link", { name: "Contas" });
        expect(accountsLink).toHaveClass("border-primary");
        expect(accountsLink).toHaveClass("text-primary");

        const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
        expect(dashboardLink).not.toHaveClass("border-primary");
    });

    it("highlights dashboard on root path", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <PrivacyProvider>
                    <Header />
                </PrivacyProvider>
            </MemoryRouter>
        );

        const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
        expect(dashboardLink).toHaveClass("border-primary");
    });
});
