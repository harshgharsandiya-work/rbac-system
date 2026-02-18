import { setAuthToken } from "@/lib/api/api";
import { logoutUser } from "@/lib/api/auth";
import { create } from "zustand";

interface AuthState {
    email: string | null;
    token: string | null;
    roles: string[];
    permissions: string[];
    organisationId: string | null;
    organisationName: string | null;

    login: (data: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    email: null,
    token: null,
    roles: [],
    permissions: [],
    organisationId: null,
    organisationName: null,

    login: (data) => {
        localStorage.setItem("token", data.token);
        setAuthToken(data.token);

        set({
            email: data.email,
            token: data.token,
            roles: data.roles,
            permissions: data.permissions,
            organisationId: data.organisationId,
            organisationName: data.organisationName,
        });
    },

    logout: async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout API failed");
        }

        localStorage.removeItem("token");
        setAuthToken(null);

        set({
            email: null,
            token: null,
            roles: [],
            permissions: [],
            organisationId: null,
            organisationName: null,
        });
    },
}));
