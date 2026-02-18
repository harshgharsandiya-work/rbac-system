import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
});

// set auth token in header
export const setAuthToken = (token: string | null) => {
    if (token) {
        //set token
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        //delete token
        delete api.defaults.headers.common["Authorization"];
    }
};

export default api;
