import { api } from "../lib/api";

export const systemConfigService = {
    getAll: async () => {
        const response = await api.get("/system-config");
        return response.data;
    },

    set: async (key: string, value: string) => {
        const response = await api.put(`/system-config/${key}`, { value });
        return response.data;
    },

    setMany: async (configs: Record<string, string>) => {
        const response = await api.post("/system-config", configs);
        return response.data;
    },
};
