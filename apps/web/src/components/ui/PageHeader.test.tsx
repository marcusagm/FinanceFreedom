import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PageHeader } from "./PageHeader";
import { BrowserRouter } from "react-router-dom";

describe("PageHeader", () => {
    const renderWithRouter = (ui: React.ReactNode) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    it("renders title correctly", () => {
        renderWithRouter(<PageHeader title="Test Title" />);
        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            "Test Title"
        );
    });

    it("renders description when provided", () => {
        renderWithRouter(
            <PageHeader title="Title" description="Test Description" />
        );
        expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("renders actions when provided", () => {
        renderWithRouter(
            <PageHeader
                title="Title"
                actions={<button>Action Button</button>}
            />
        );
        expect(screen.getByText("Action Button")).toBeInTheDocument();
    });

    it("renders back link when provided", () => {
        renderWithRouter(<PageHeader title="Title" backLink="/previous" />);
        const link = screen.getByRole("link", { name: /voltar/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/previous");
    });

    it("does not render back link when not provided", () => {
        renderWithRouter(<PageHeader title="Title" />);
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});
