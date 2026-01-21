export interface CreditCard {
    id: string;
    name: string;
    brand: string;
    limit: number;
    closingDay: number;
    dueDay: number;
    userId: string;
    paymentAccountId?: string;
    accountId: string;
    account?: {
        id: string;
        name: string;
        balance: number;
        currency: string;
        type: string;
    };
    createdAt: string;
}

export interface CreateCreditCardDTO {
    name: string;
    brand: string;
    limit: number;
    closingDay: number;
    dueDay: number;
    paymentAccountId?: string;
}

export interface UpdateCreditCardDTO extends Partial<CreateCreditCardDTO> {}

export interface InvoiceTransaction {
    id: string;
    description: string;
    amount: number;
    date: string; // ISO Date
    category?: {
        id: string;
        name: string;
        icon?: string;
        color?: string;
    };
    installmentNumber?: number;
    totalInstallments?: number;
}

export type InvoiceStatus = "OPEN" | "CLOSED" | "FUTURE" | "OVERDUE";

export interface Invoice {
    status: InvoiceStatus;
    total: number;
    period: {
        start: string;
        end: string;
    };
    dueDate: string;
    transactions: InvoiceTransaction[];
}
