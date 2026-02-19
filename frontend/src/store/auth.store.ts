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
    _hasHydrated: boolean;

    setHasHydrated: (hydrated: boolean) => void;
    login: (data: LoginResponse) => void;
    logout: () => Promise<void>;
    switchOrg: (organisationId: string) => Promise<void>;
    fetchOrganisations: () => Promise<void>;
    updateOrganisationName: (name: string) => void;
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
            _hasHydrated: false,

            setHasHydrated: (hydrated: boolean) => {
                set({ _hasHydrated: hydrated });
            },

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

            updateOrganisationName: (name: string) => {
                set({ organisationName: name });
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                email: state.email,
                token: state.token,
                roles: state.roles,
                permissions: state.permissions,
                organisationId: state.organisationId,
                organisationName: state.organisationName,
                organisations: state.organisations,
            }),
            onRehydrateStorage: () => {
                return (state) => {
                    if (state?.token) {
                        setAuthToken(state.token);
                    }
                    if (state) {
                        state.setHasHydrated(true);
                    } else {
                        useAuthStore.getState().setHasHydrated(true);
                    }
                };
            },
        },
    ),
);
