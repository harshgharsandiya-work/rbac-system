export interface Permission {
    id: string;
    key: string;
    description?: string;
    organisationId: string;
}

export interface CreatePermissionPayload {
    key: string;
    description?: string;
}

export interface UpdatePermissionPayload {
    key?: string;
    description?: string;
}
