import { api } from "../lib/api";

export interface ImportedTransaction {
    amount: number;
    date: string;
    description: string;
    type: string;
    accountId: string;
    category: string;
}

export const ImportService = {
    uploadFile: async (file: File, accountId: string): Promise<ImportedTransaction[]> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("accountId", accountId);

        const response = await api.post<ImportedTransaction[]>("/import/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    confirmImport: async (transactions: ImportedTransaction[]) => {
        const response = await api.post("/import/confirm", transactions);
        return response.data;
    },

    syncNow: async (accountId?: string) => {
        const response = await api.post("/import/sync-now", { accountId });
        return response.data;
    },
};
