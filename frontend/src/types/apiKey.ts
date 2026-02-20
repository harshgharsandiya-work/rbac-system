export interface ApiKey {
    id: string;
    name: string;
    revoked: boolean;
    createdAt: string;
    expiresAt?: string;
}

export interface CreateApiKeyPayload {
    name: string;
}

export interface CreateApiKeyResponse {
    id: string;
    name: string;
    key: string;
    expiresAt?: string;
}

export interface RevokeApiKeyResponse {
    message: string;
}

export interface DeleteApiKeyResponse {
    message: string;
}

export interface ApiKeysListResponse extends Array<ApiKey> {}

export interface ApiKeyParams {
    id: string;
}
