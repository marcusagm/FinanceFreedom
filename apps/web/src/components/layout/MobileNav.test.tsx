import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { MobileNav } from "./MobileNav";

// Mock Sheet components to avoid Radix interactions in simple unit test
vi.mock("../ui/Sheet", () => ({
    Sheet: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SheetTrigger: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SheetContent: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

// Mock Sidebar since it is rendered inside the Sheet
vi.mock("./Sidebar", () => ({
    Sidebar: () => <div data-testid="mock-sidebar">Sidebar Content</div>,
}));

describe("MobileNav Component", () => {
    const renderMobileNav = () => {
        return render(
            <BrowserRouter>
                <MobileNav />
            </BrowserRouter>
        );
    };

    it("renders main navigation links", () => {
        renderMobileNav();
        expect(screen.getByText("Início")).toBeInTheDocument();
        expect(screen.getByText("Transações")).toBeInTheDocument();
        expect(screen.getByText("Renda")).toBeInTheDocument();
        expect(screen.getByText("Dívidas")).toBeInTheDocument();
    });

    it("renders menu button", () => {
        renderMobileNav();
        expect(screen.getByText("Menu")).toBeInTheDocument();
    });

    it("contains correct link paths", () => {
        renderMobileNav();
        expect(screen.getByText("Início").closest("a")).toHaveAttribute(
            "href",
            "/"
        );
        expect(screen.getByText("Transações").closest("a")).toHaveAttribute(
            "href",
            "/transactions"
        );
        expect(screen.getByText("Renda").closest("a")).toHaveAttribute(
            "href",
            "/income"
        );
        expect(screen.getByText("Dívidas").closest("a")).toHaveAttribute(
            "href",
            "/debts"
        );
    });
});
