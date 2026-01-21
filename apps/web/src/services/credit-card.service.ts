import { api } from "../lib/api";
import type {
    CreateCreditCardDTO,
    CreditCard,
    Invoice,
    UpdateCreditCardDTO,
} from "../types/credit-card";

export const creditCardService = {
    getAll: async (): Promise<CreditCard[]> => {
        const response = await api.get<CreditCard[]>("/credit-cards");
        return response.data;
    },

    getById: async (id: string): Promise<CreditCard> => {
        const response = await api.get<CreditCard>(`/credit-cards/${id}`);
        return response.data;
    },

    create: async (data: CreateCreditCardDTO): Promise<CreditCard> => {
        const response = await api.post<CreditCard>("/credit-cards", data);
        return response.data;
    },

    update: async (
        id: string,
        data: UpdateCreditCardDTO,
    ): Promise<CreditCard> => {
        const response = await api.patch<CreditCard>(
            `/credit-cards/${id}`,
            data,
        );
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/credit-cards/${id}`);
    },

    getInvoice: async (
        id: string,
        month: number,
        year: number,
    ): Promise<Invoice> => {
        const response = await api.get<Invoice>(`/credit-cards/${id}/invoice`, {
            params: { month, year },
        });
        return response.data;
    },

    getAvailableLimit: async (id: string): Promise<number> => {
        const response = await api.get<number>(`/credit-cards/${id}/limit`);
        return response.data;
    },
};
