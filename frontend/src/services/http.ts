import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

export const http = axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});

http.interceptors.request.use((config) => {
const auth = useAuthStore();
if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
}
return config;
});

http.interceptors.response.use(
(res) => res,
(err) => {
    if (err?.response?.status === 401) {
    const auth = useAuthStore();
    auth.logout();
    window.location.href = "/login";
    }
    return Promise.reject(err);
}
);
