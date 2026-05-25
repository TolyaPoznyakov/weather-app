import axios from "axios";
import i18n from "../i18n";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    config.params = {
        ...config.params,
        key: import.meta.env.VITE_API_KEY,
        lang: i18n.global.locale.value === "uk" ? "uk" : "en",
    };

    return config;
});

export default api;