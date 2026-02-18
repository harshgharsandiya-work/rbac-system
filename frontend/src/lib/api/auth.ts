import api from "./api";

import {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    RegisterResponse,
    verifyEmailPayload,
    forgotPasswordPayload,
    verifyResetPasswordPayload,
} from "../../types/auth";

//register
export const registerUser = async (
    data: RegisterPayload,
): Promise<RegisterResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

//verify-email
export const verifyEmail = async (data: verifyEmailPayload) => {
    const response = await api.post("/auth/verify-email", data);

    return response.data;
};

//login
export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", data);

    return response.data;
};

//logout
export const logoutUser = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
};

//forgot password (send OTP)
export const forgotPassword = async (data: forgotPasswordPayload) => {
    const response = await api.post("/auth/forgot-password", data);

    return response.data;
};

//verify reset password OTP
export const verifyResetPassword = async (data: verifyResetPasswordPayload) => {
    const response = await api.post("/auth/reset-password-token", data);

    return response.data;
};
