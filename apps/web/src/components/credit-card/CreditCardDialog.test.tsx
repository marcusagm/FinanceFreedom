import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreditCardDialog } from "./CreditCardDialog";
import { vi } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../lib/i18n";

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../../services/credit-card.service", () => ({
    creditCardService: {
        create: vi.fn(),
        update: vi.fn(),
    },
}));

const renderComponent = (
    props: React.ComponentProps<typeof CreditCardDialog>,
) => {
    return render(
        <I18nextProvider i18n={i18n}>
            <CreditCardDialog {...props} />
        </I18nextProvider>,
    );
};

describe("CreditCardDialog", () => {
    it("renders create form correctly", () => {
        renderComponent({
            open: true,
            onOpenChange: vi.fn(),
            onSuccess: vi.fn(),
        });

        expect(screen.getByText("creditCard.addNew")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("common.namePlaceholder"),
        ).toBeInTheDocument();
    });

    // Additional tests for submission validation, etc.
});
