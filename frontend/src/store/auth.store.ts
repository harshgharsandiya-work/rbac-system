import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken } from "@/lib/api/api";
import { logoutUser } from "@/lib/api/auth";
import { LoginResponse } from "@/types/auth";
import { switchOrganisation, getAllOrganisations, OrganisationSummary } from "@/lib/api/organisation";

interface AuthState {
    email: string | null;
    token: string | null;
    roles: string[];
    permissions: string[];
    organisationId: string | null;
    organisationName: string | null;
    organisations: OrganisationSummary[];
    switchingOrg: boolean;

    login: (data: LoginResponse) => void;
    logout: () => void;
    switchOrg: (organisationId: string) => Promise<void>;
    fetchOrganisations: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            email: null,
            token: null,
            roles: [],
            permissions: [],
            organisationId: null,
            organisationName: null,
            organisations: [],
            switchingOrg: false,

            login: (data: LoginResponse) => {
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
                    console.error("Logout API failed", error);
                }

                setAuthToken(null);

                set({
                    email: null,
                    token: null,
                    roles: [],
                    permissions: [],
                    organisationId: null,
                    organisationName: null,
                    organisations: [],
                    switchingOrg: false,
                });
            },

            fetchOrganisations: async () => {
                try {
                    const orgs = await getAllOrganisations();
                    set({ organisations: orgs });
                } catch (error) {
                    console.error("Failed to fetch organisations", error);
                }
            },

            switchOrg: async (organisationId: string) => {
                const { organisationId: currentOrgId } = get();
                if (organisationId === currentOrgId) return;

                set({ switchingOrg: true });
                try {
                    const data = await switchOrganisation(organisationId);
                    setAuthToken(data.token);

                    set({
                        token: data.token,
                        organisationId: data.organisationId,
                        organisationName: data.organisationName,
                        roles: data.roles,
                        permissions: data.permissions,
                        switchingOrg: false,
                    });
                } catch (error) {
                    set({ switchingOrg: false });
                    throw error;
                }
            },
        }),
        {
            name: "auth-storage",
        },
    ),
);
