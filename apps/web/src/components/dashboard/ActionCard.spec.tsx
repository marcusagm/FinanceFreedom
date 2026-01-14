import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import type { ActionRecommendation } from "../../services/dashboard.service";
import { ActionCard } from "./ActionCard";

describe("ActionCard", () => {
    const mockRecommendation: ActionRecommendation = {
        type: "PAY_DEBT",
        title: "Test Recommendation",
        description: "Test Description",
        actionLabel: "Test Action",
        actionLink: "/test-link",
        priority: "HIGH",
    };

    const renderComponent = (props = mockRecommendation) => {
        return render(
            <BrowserRouter>
                <ActionCard recommendation={props} />
            </BrowserRouter>,
        );
    };

    it("renders title and description", () => {
        renderComponent();
        expect(screen.getByText("Test Recommendation")).toBeDefined();
        expect(screen.getByText("Test Description")).toBeDefined();
    });

    it("renders action button with correct link", () => {
        renderComponent();
        const link = screen.getByRole("link", { name: /Test Action/i });
        expect(link).toBeDefined();
        expect(link.getAttribute("href")).toBe("/test-link");
    });

    it("renders critical priority badge", () => {
        renderComponent({
            ...mockRecommendation,
            priority: "CRITICAL",
        });
        expect(screen.getByText("Crítico")).toBeDefined();
    });

    it("does not render critical badge for non-critical priority", () => {
        renderComponent({
            ...mockRecommendation,
            priority: "HIGH",
        });
        expect(screen.queryByText("Crítico")).toBeNull();
    });
});
