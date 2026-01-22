import { api } from "../lib/api";

export interface Category {
    id: string;
    name: string;
    color?: string;
    icon?: string;
    type?: string;
    budgetLimit?: number;
    parentId?: string;
}

export const categoryService = {
    getAll: async () => {
        const response = await api.get("/categories");
        return response.data;
    },

    create: async (data: Partial<Category>) => {
        const response = await api.post("/categories", data);
        return response.data;
    },

    update: async (id: string, data: Partial<Category>) => {
        const response = await api.patch(`/categories/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};
