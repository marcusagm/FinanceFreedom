import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { Layout } from "./Layout";

// Mock Header because we test it separately
vi.mock("./Header", () => ({
    Header: () => <header data-testid="mock-header">Header</header>,
}));

describe("Layout", () => {
    it("renders header and children", () => {
        render(
            <MemoryRouter>
                <Layout>
                    <div data-testid="child-content">Child</div>
                </Layout>
            </MemoryRouter>,
        );
        expect(screen.getByTestId("mock-header")).toBeInTheDocument();
        expect(screen.getByTestId("child-content")).toBeInTheDocument();
    });

    it("renders mobile navigation", () => {
        render(
            <MemoryRouter>
                <Layout>Child</Layout>
            </MemoryRouter>,
        );
        // Check for mobile nav links by icon names or text
        expect(screen.getByText("Início")).toBeInTheDocument();
        expect(screen.getByText("Contas")).toBeInTheDocument();
        expect(screen.getByText("Transações")).toBeInTheDocument();
        expect(screen.getByText("Renda")).toBeInTheDocument();
    });

    it("highlights active mobile link", () => {
        render(
            <MemoryRouter initialEntries={["/income"]}>
                <Layout>Child</Layout>
            </MemoryRouter>,
        );

        // Find the link that contains "Renda"
        // Note: The structure is Link -> svg + span("Renda")
        // We can find the link by role "link" and check class
        const incomeLink = screen.getByRole("link", { name: /renda/i });
        expect(incomeLink).toHaveClass("text-primary");

        const homeLink = screen.getByRole("link", { name: /início/i });
        expect(homeLink).not.toHaveClass("text-primary");
    });
});
