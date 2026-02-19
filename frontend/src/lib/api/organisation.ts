import api from "./api";

export interface Organisation {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface OrganisationSummary {
    id: string;
    name: string;
    slug: string;
}

export interface SwitchOrganisationResponse {
    token: string;
    organisationId: string;
    organisationName: string;
    roles: string[];
    permissions: string[];
}

export const getOrganisation = async (): Promise<Organisation> => {
    const response = await api.get("/organisation");
    return response.data;
};

export const getAllOrganisations = async (): Promise<OrganisationSummary[]> => {
    const response = await api.get("/organisation/all");
    return response.data;
};

export const updateOrganisation = async (data: {
    name?: string;
    slug?: string;
}) => {
    const response = await api.patch("/organisation", data);
    return response.data;
};

export const switchOrganisation = async (organisationId: string): Promise<SwitchOrganisationResponse> => {
    const response = await api.post("/organisation/switch", { organisationId });
    return response.data;
};

export const createOrganisation = async (data: {
    name: string;
    slug: string;
}) => {
    const response = await api.post("/organisation", data);
    return response.data;
};
