export interface RegisterPayload {
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    email: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    email: string;
    token: string;
    organisationId: string;
    organisationName: string;
    organisationStatus: boolean;
    roles: string[];
    permissions: string[];
}

export interface verifyEmailPayload {
    email: string;
    token: string;
}

export interface forgotPasswordPayload {
    email: string;
}

export interface verifyResetPasswordPayload {
    email: string;
    token: string;
    newPassword: string;
}
