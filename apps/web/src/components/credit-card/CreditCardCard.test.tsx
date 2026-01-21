// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CreditCardCard } from "./CreditCardCard";
import { describe, it, expect, vi } from "vitest";
import type { CreditCard } from "../../types/credit-card";

// Mock API to prevent side-effects
vi.mock("../../lib/api", () => ({
    api: {},
}));

// Mock translations
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, options?: any) => {
            if (key === "creditCard.limit") return `Limit: ${options?.value}`;
            return key;
        },
    }),
}));

// Mock child components to avoid deep rendering issues
vi.mock("../ui/MoneyDisplay", () => ({
    MoneyDisplay: ({ value }: { value: number }) => (
        <span data-testid="money-display">{value}</span>
    ),
}));

vi.mock("../ui/Progress", () => ({
    Progress: ({ value }: { value: number }) => (
        <div data-testid="progress">{value}%</div>
    ),
}));

vi.mock("../../lib/utils", () => ({
    cn: (...inputs: any[]) => inputs.join(" "),
}));

const mockCard: CreditCard = {
    id: "1",
    name: "Nubank",
    brand: "Mastercard",
    limit: 5000,
    closingDay: 10,
    dueDay: 17,
    userId: "user1",
    createdAt: "2023-01-01",
};

describe("CreditCardCard", () => {
    it("renders card details correctly", () => {
        render(<CreditCardCard card={mockCard} availableLimit={4000} />);

        expect(screen.getByText("Nubank")).toBeDefined();
        expect(screen.getByText("Mastercard")).toBeDefined();
        // The component uses children or specific structure for limit.
        // With mock translation it returns "Limit: 5000"
        expect(screen.getByText("Limit: 5000")).toBeDefined();
    });

    it("renders correct usage percentage", () => {
        render(
            <CreditCardCard
                card={mockCard}
                availableLimit={100}
                currentInvoiceTotal={4900}
            />,
        );
        // We mocked Progress to show value%
        // Usage: (5000 - 100) / 5000 = 98%
        const progress = screen.getByTestId("progress");
        expect(progress).toHaveTextContent("98%");
    });

    it("calls onClick when clicked", () => {
        const handleClick = vi.fn();
        render(
            <CreditCardCard
                card={mockCard}
                availableLimit={2500}
                onClick={handleClick}
            />,
        );

        // Find button by title (which comes from mock translation)
        // Or inspect the DOM structure if title is not passing through.
        // Assuming title="creditCard.viewInvoices"
        const viewInvoicesButton = screen.getByTitle("creditCard.viewInvoices");
        fireEvent.click(viewInvoicesButton);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
