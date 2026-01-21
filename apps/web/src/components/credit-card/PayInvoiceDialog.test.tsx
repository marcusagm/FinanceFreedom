import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PayInvoiceDialog } from "./PayInvoiceDialog";
import { vi } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../lib/i18n";

// Mock dependencies
// Mock useQuery to return accounts
const mockAccounts = [
    { id: "acc1", name: "Conta Corrente", type: "CHECKING" },
    { id: "acc2", name: "Poupança", type: "SAVINGS" },
    { id: "acc3", name: "Cartão X", type: "CREDIT_CARD" }, // Should be filtered out
];

vi.mock("@tanstack/react-query", () => ({
    useQuery: vi.fn(({ queryKey }) => {
        if (queryKey[0] === "accounts") {
            return { data: mockAccounts, isLoading: false };
        }
        return { data: null, isLoading: false };
    }),
}));

const renderComponent = (
    props: React.ComponentProps<typeof PayInvoiceDialog>,
) => {
    return render(
        <I18nextProvider i18n={i18n}>
            <PayInvoiceDialog {...props} />
        </I18nextProvider>,
    );
};

describe("PayInvoiceDialog", () => {
    it("renders correctly when open", () => {
        renderComponent({
            open: true,
            onOpenChange: vi.fn(),
            invoiceTotal: 1000,
            onConfirm: vi.fn(),
        });

        expect(screen.getByText("creditCard.payInvoice")).toBeInTheDocument();
        // Check description with value
        expect(screen.getByText(/1000/)).toBeInTheDocument();
    });

    it("filters out CREDIT_CARD accounts", async () => {
        renderComponent({
            open: true,
            onOpenChange: vi.fn(),
            invoiceTotal: 1000,
            onConfirm: vi.fn(),
        });

        // Open select (Select trigger usually has the placeholder)
        // Note: Shadcn Select might be hard to test with standard fireEvent if it uses Radix primitives deeply.
        // Assuming we can find the trigger or use a localized text for placeholder.
        const trigger = screen.getByText("common.selectAccount");
        fireEvent.click(trigger);

        // Expect options to be visible
        // We might need to use `await screen.findByText("Conta Corrente")`
        expect(await screen.findByText("Conta Corrente")).toBeInTheDocument();
        expect(screen.getByText("Poupança")).toBeInTheDocument();

        // Should NOT find Cartão X
        expect(screen.queryByText("Cartão X")).not.toBeInTheDocument();
    });

    it("calls onConfirm with selected account", async () => {
        const onConfirm = vi.fn();
        renderComponent({
            open: true,
            onOpenChange: vi.fn(),
            invoiceTotal: 1000,
            onConfirm,
        });

        const trigger = screen.getByText("common.selectAccount");
        fireEvent.click(trigger);

        const option = await screen.findByText("Conta Corrente");
        fireEvent.click(option);

        const payButton = screen.getByText("common.pay");
        // Button should be enabled now
        expect(payButton).not.toBeDisabled();

        fireEvent.click(payButton);
        expect(onConfirm).toHaveBeenCalledWith("acc1");
    });
});
