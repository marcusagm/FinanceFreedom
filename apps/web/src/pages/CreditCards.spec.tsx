// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { CreditCards } from "./CreditCards";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock components
vi.mock("../components/credit-card/CreditCardCard", () => ({
    CreditCardCard: ({ card }: any) => <div>Card: {card.name}</div>,
}));

vi.mock("../components/credit-card/CreditCardDialog", () => ({
    CreditCardDialog: () => <div>CreditCardDialog</div>,
}));

// Mock Service
vi.mock("../services/credit-card.service", () => ({
    creditCardService: {
        getAll: vi
            .fn()
            .mockResolvedValue([{ id: "1", name: "Test Card", limit: 1000 }]),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}));

// Mock translations
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const queryClient = new QueryClient();

describe("CreditCards Page", () => {
    it("renders credit card list", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <CreditCards />
            </QueryClientProvider>,
        );

        expect(await screen.findByText("Card: Test Card")).toBeDefined();
    });
});
