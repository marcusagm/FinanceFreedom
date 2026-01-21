import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { QuickActionFAB } from "./QuickActionFAB";

// Mock translations
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock API and Services
vi.mock("../../lib/api", () => ({
    api: {
        get: vi.fn().mockResolvedValue({ data: [] }),
    },
}));

vi.mock("../../services/category.service", () => ({
    categoryService: {
        getAll: vi.fn().mockResolvedValue([]),
    },
}));

vi.mock("../../services/credit-card.service", () => ({
    creditCardService: {
        getAll: vi.fn().mockResolvedValue([]),
    },
}));

// Mock UI Components
vi.mock("../ui/DropdownMenu", () => ({
    DropdownMenu: ({ children }: any) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children }: any) => <button>{children}</button>,
    DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
    DropdownMenuItem: ({ children, onClick }: any) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

vi.mock("../ui/Button", () => ({
    Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    ),
}));

vi.mock("lucide-react", () => ({
    Plus: () => <span>+</span>,
    Wallet: () => <span>Wallet</span>,
    CreditCard: () => <span>CreditCard</span>,
}));

// Mock child components to avoid complex rendering and focus on FAB logic
vi.mock("../transactions/NewTransactionDialog", () => ({
    NewTransactionDialog: ({
        isOpen,
        accounts,
        creditCards,
    }: {
        isOpen: boolean;
        accounts: any[];
        creditCards: any[];
    }) =>
        isOpen ? (
            <div data-testid="new-transaction-dialog">
                Transaction Dialog (Accounts: {accounts ? accounts.length : 0},
                Cards: {creditCards ? creditCards.length : 0})
            </div>
        ) : null,
}));

vi.mock("../debt/DebtForm", () => ({
    DebtForm: ({ isOpen }: { isOpen: boolean }) =>
        isOpen ? <div data-testid="debt-form">Debt Form</div> : null,
}));

describe("QuickActionFAB", () => {
    it("renders the FAB button", () => {
        render(<QuickActionFAB />);
        // Might need aria-label or find by role button
        const fab = screen.getByRole("button");
        expect(fab).toBeInTheDocument();
    });

    it("opens the menu on click", async () => {
        render(<QuickActionFAB />);
        const fab = screen.getByRole("button");
        fireEvent.click(fab);

        await waitFor(() => {
            expect(screen.getByText("Nova Transação")).toBeInTheDocument();
            expect(screen.getByText("Nova Dívida")).toBeInTheDocument();
        });
    });

    it("opens transaction dialog when clicked", async () => {
        render(<QuickActionFAB />);
        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => screen.getByText("Nova Transação"));
        fireEvent.click(screen.getByText("Nova Transação"));

        expect(
            await screen.findByTestId("new-transaction-dialog"),
        ).toBeInTheDocument();
    });

    it("opens debt form when clicked", async () => {
        render(<QuickActionFAB />);
        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => screen.getByText("Nova Dívida"));
        fireEvent.click(screen.getByText("Nova Dívida"));

        expect(await screen.findByTestId("debt-form")).toBeInTheDocument();
    });
});
