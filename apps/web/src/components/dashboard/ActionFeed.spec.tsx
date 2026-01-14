import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import type { ActionRecommendation } from "../../services/dashboard.service";
import { ActionFeed } from "./ActionFeed";

describe("ActionFeed", () => {
    const mockRecommendations: ActionRecommendation[] = [
        {
            type: "PAY_DEBT",
            title: "Rec 1",
            description: "Desc 1",
            actionLabel: "Act 1",
            actionLink: "/link1",
            priority: "HIGH",
        },
        {
            type: "INVEST",
            title: "Rec 2",
            description: "Desc 2",
            actionLabel: "Act 2",
            actionLink: "/link2",
            priority: "MEDIUM",
        },
    ];

    const renderComponent = (recs = mockRecommendations) => {
        return render(
            <BrowserRouter>
                <ActionFeed recommendations={recs} />
            </BrowserRouter>,
        );
    };

    it("renders nothing when recommendations are empty", () => {
        const { container } = renderComponent([]);
        expect(container).toBeEmptyDOMElement();
    });

    it("renders title when recommendations exist", () => {
        renderComponent();
        expect(screen.getByText("Recommended Actions")).toBeDefined();
    });

    it("renders correct number of cards", () => {
        renderComponent();
        expect(screen.getByText("Rec 1")).toBeDefined();
        expect(screen.getByText("Rec 2")).toBeDefined();
    });
});
