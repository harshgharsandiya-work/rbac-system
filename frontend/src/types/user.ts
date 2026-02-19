export interface User {
    id: string;
    email: string;
    role: string;
}

export interface InviteUserPayload {
    email: string;
    roleIds: string[];
}

export interface UpdateUserRolesPayload {
    roleIds: string[];
}
