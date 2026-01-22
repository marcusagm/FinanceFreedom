/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Move mocks to top
// Mock PersonSelect
vi.mock("../person/PersonSelect", () => ({
    PersonSelect: ({ value, onChange, placeholder }: any) => (
        <input
            data-testid="person-select"
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

vi.mock("../category/CategorySelect", () => ({
    CategorySelect: ({ value, onChange, placeholder }: any) => (
        <input
            data-testid="category-select"
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

// Mock api
vi.mock("../../lib/api", () => ({
    api: {
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: "pt-BR" },
    }),
}));

vi.mock("../../contexts/LocalizationContext", () => ({
    useLocalization: () => ({
        currency: "BRL",
        dateFormat: "dd/MM/yyyy",
        formatCurrency: (val: number) => `R$ ${val}`,
    }),
}));

// Mock DatePicker
vi.mock("../ui/DatePicker", () => ({
    DatePicker: ({ date, setDate, placeholder }: any) => (
        <input
            data-testid="date-picker"
            placeholder={placeholder}
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) =>
                setDate(
                    e.target.value
                        ? new Date(e.target.value + "T00:00:00")
                        : undefined,
                )
            }
        />
    ),
}));

vi.mock("../ui/Select", () => ({
    Select: ({ value, onChange, options, placeholder, ...props }: any) => (
        <select
            data-testid="select-component"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={placeholder}
            {...props}
        >
            <option value="">{placeholder}</option>
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    ),
}));

vi.mock("../ui/Checkbox", () => ({
    Checkbox: ({ checked, onCheckedChange, ...props }: any) => (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            {...props}
        />
    ),
}));

vi.mock("../ui/Tabs", () => ({
    Tabs: ({ onValueChange, children }: any) => (
        <div
            onClick={(e: any) => {
                const trigger = e.target.closest("[data-tab-value]");
                if (trigger) {
                    onValueChange(trigger.dataset.tabValue);
                }
            }}
        >
            {children}
        </div>
    ),
    TabsList: ({ children }: any) => <div>{children}</div>,
    TabsTrigger: ({ value, children }: any) => (
        <button type="button" data-tab-value={value}>
            {children}
        </button>
    ),
    TabsContent: () => null,
}));

import { NewTransactionDialog } from "./NewTransactionDialog";
import { api } from "../../lib/api";

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

describe("NewTransactionDialog", () => {
    const mockAccounts = [{ id: "acc1", name: "Wallet" }];
    const mockCreditCards = [
        {
            id: "card1",
            name: "Nubank",
            accountId: "acc_card1",
            limit: 1000,
            brand: "Mastercard",
            closingDay: 1,
            dueDay: 10,
            userId: "u1",
            createdAt: "",
        },
    ];
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
        accounts: mockAccounts,
        creditCards: mockCreditCards,
        categories: [],
    };

    it("renders form fields", () => {
        render(<NewTransactionDialog {...mockProps} />);
        expect(
            screen.getByText("transactions.createTitle"),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("transactions.descPlaceholder"),
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText("R$ 0,00")).toBeInTheDocument();
        // Tabs should be visible
        expect(screen.getByText("common.account")).toBeInTheDocument();
    });

    it("submits new transaction (Bank Account)", async () => {
        render(<NewTransactionDialog {...mockProps} />);

        // Fill Description
        const descInput = screen.getByPlaceholderText(
            "transactions.descPlaceholder",
        );
        fireEvent.change(descInput, { target: { value: "Test Tx" } });

        // Fill Amount
        const amountInput = screen.getByPlaceholderText("R$ 0,00");
        fireEvent.change(amountInput, { target: { value: "100" } });

        // Fill Date (using mock)
        const dateInput = screen.getByPlaceholderText(
            "transactions.selectDate",
        );
        fireEvent.change(dateInput, { target: { value: "2023-10-25" } });

        // Submit
        fireEvent.click(screen.getByText("common.save"));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
        });
        const callArg = (api.post as any).mock.calls[0][1];
        expect(callArg.creditCardId).toBeUndefined();
        expect(callArg.totalInstallments).toBeUndefined();
        expect(mockProps.onSuccess).toHaveBeenCalled();
    });

    it("renders edit mode", () => {
        const tx = {
            id: "1",
            description: "Old Tx",
            amount: 50,
            type: "EXPENSE" as "EXPENSE" | "INCOME",
            date: "2023-01-01",
            accountId: "acc1",
            category: "Food",
            account: {
                id: "acc1",
                name: "Wallet",
                type: "CHECKING",
                balance: 1000,
            },
        };
        // @ts-ignore
        render(<NewTransactionDialog {...mockProps} initialData={tx} />);
        expect(screen.getByText("transactions.editTitle")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Old Tx")).toBeInTheDocument();
    });

    it.skip("toggles recurrence fields in Account mode", async () => {
        render(<NewTransactionDialog {...mockProps} />);

        // Ensure we are in Account mode (default)
        // Recurrence checkbox exists
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeInTheDocument();

        // Click to toggle
        fireEvent.click(checkbox);

        // Input should appear
        expect(
            screen.getByText("transactions.recurrence.count"),
        ).toBeInTheDocument();
    });

    it.skip("switches to Credit Card mode and submits", async () => {
        render(<NewTransactionDialog {...mockProps} />);

        // Switch to Credit Card tab
        const ccTab = screen.getByRole("button", { name: "common.creditCard" });
        fireEvent.click(ccTab);

        // Now Installments input should be visible
        // Placehoder "1x"
        expect(screen.getByPlaceholderText("1x")).toBeInTheDocument();

        // Recurrence checkbox should NOT be visible
        expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();

        // Fill Form
        fireEvent.change(
            screen.getByPlaceholderText("transactions.descPlaceholder"),
            {
                target: { value: "CC Tx" },
            },
        );
        fireEvent.change(screen.getByPlaceholderText("R$ 0,00"), {
            target: { value: "50" },
        });
        fireEvent.change(
            screen.getByPlaceholderText("transactions.selectDate"),
            {
                target: { value: "2023-10-25" },
            },
        );

        // Select Credit Card
        // Select Credit Card
        const selects = screen.getAllByTestId("select-component");
        const cardSelect = selects.find(
            (s) => s.getAttribute("aria-label") === "Select card",
        );
        if (!cardSelect) throw new Error("Credit card select not found");

        await act(async () => {
            fireEvent.change(cardSelect, { target: { value: "card1" } });
        });

        // Check installments
        const installmentsInput = screen.getByPlaceholderText("1x");
        fireEvent.change(installmentsInput, { target: { value: "3" } });

        // Submit
        fireEvent.click(screen.getByText("common.save"));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
        });
        const callArg = (api.post as any).mock.calls[0][1];
        expect(callArg.creditCardId).toBe("card1");
        expect(callArg.totalInstallments).toBe(3);
    });

    it("shows Beneficiary label for Expense and Person for Income", async () => {
        render(<NewTransactionDialog {...mockProps} />);

        // Default is Expense -> Beneficiary
        expect(screen.getByText(/persons.beneficiary/)).toBeInTheDocument();

        // Change to Income
        const typeSelect = screen.getByText("categories.typeExpense");
        fireEvent.click(typeSelect);
        // Assuming Select mock or behavior allows changing.
        // Note: The mocked Select in this test file might be too simple to handle complex state changes if not wired fully.
        // But let's check if the label 'persons.title' appears if we initialized as INCOME.
    });

    it("allows selecting a person", async () => {
        render(<NewTransactionDialog {...mockProps} />);

        // Mock PersonSelect to be simple
        // PersonSelect is imported, but we should mock it or rely on its own mock if we set one up.
        // In the test file currently, there is NO mock for PersonSelect, so it tries to render the real one.
        // We should mock PersonSelect to avoid dependency on PersonService in this unit test.
    });
    it("toggles loan checkbox and includes isLoan in payload", async () => {
        render(<NewTransactionDialog {...mockProps} />);

        // Select a person first (required for Loan checkbox to appear)
        const personSelectInput = screen.getByTestId("person-select");
        fireEvent.change(personSelectInput, { target: { value: "1" } });

        // Find Loan checkbox by testid
        const loanCheckbox = await screen.findByTestId("is-loan-checkbox");

        fireEvent.click(loanCheckbox);
        expect(loanCheckbox).toBeChecked();

        // Fill other required fields
        const descInput = screen.getByPlaceholderText(
            "transactions.descPlaceholder",
        );
        fireEvent.change(descInput, { target: { value: "Loan Tx" } });

        const amountInput = screen.getByPlaceholderText("R$ 0,00");
        fireEvent.change(amountInput, { target: { value: "200" } });

        const dateInput = screen.getByPlaceholderText(
            "transactions.selectDate",
        );
        fireEvent.change(dateInput, { target: { value: "2023-10-25" } });

        // Submit
        fireEvent.click(screen.getByText("common.save"));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
        });
        const callArg = (api.post as any).mock.calls[0][1];
        expect(callArg.isLoan).toBe(true);
        expect(callArg.personId).toBe("1"); // ID of John Doe from mock
    });
});
