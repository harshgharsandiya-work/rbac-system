import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestAuthHeader = error.config?.headers?.Authorization;

        // Only logout if:
        // 1. Status is 401
        // 2. This request actually sent a Bearer token
        if (status === 401 && requestAuthHeader) {
            setAuthToken(null);

            if (typeof window !== "undefined") {
                localStorage.removeItem("auth-storage");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default api;
