import api from "@/lib/api/api";

import {
    ApiKey,
    ApiKeyParams,
    ApiKeysListResponse,
    CreateApiKeyPayload,
    CreateApiKeyResponse,
    DeleteApiKeyResponse,
    RevokeApiKeyResponse,
} from "@/types/apiKey";

// create a new API key
export const createApiKey = async (
    data: CreateApiKeyPayload,
): Promise<CreateApiKeyResponse> => {
    const res = await api.post("/keys", data);
    return res.data;
};

// list API keys for the current user
export const getUserApiKeys = async (): Promise<ApiKey[]> => {
    const res = await api.get("/keys");
    return res.data;
};

// list all API keys for the organisation
export const getAllApiKeys = async (): Promise<ApiKey[]> => {
    const res = await api.get("/keys/all");
    return res.data;
};

// revoke an API key
export const revokeApiKey = async (
    id: string,
): Promise<RevokeApiKeyResponse> => {
    const res = await api.patch(`/keys/${id}/revoke`);
    return res.data;
};

// delete an API key
export const deleteApiKey = async (
    id: string,
): Promise<DeleteApiKeyResponse> => {
    const res = await api.delete(`/keys/${id}`);
    return res.data;
};
