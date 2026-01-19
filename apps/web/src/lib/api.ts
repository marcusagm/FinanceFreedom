import axios from "axios";
import i18n from "../i18n";

export const api = axios.create({
    baseURL: (import.meta as any).env.VITE_API_URL || "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    config.headers["Accept-Language"] = i18n.language;
    // Add Authorization header if token exists
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
