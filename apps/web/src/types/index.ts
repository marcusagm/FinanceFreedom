export interface Account {
    id: string;
    name: string;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category?: string;
    categoryId?: string;
    accountId: string;
    account: {
        name: string;
    };
    creditCardId?: string;
    totalInstallments?: number;
    installmentNumber?: number;
    isRecurring?: boolean;
    repeatCount?: number;
    createdAt?: string;
    updatedAt?: string;
}
