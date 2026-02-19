import api from "./api";
import { User, InviteUserPayload, UpdateUserRolesPayload } from "@/types/user";

// get all users
export const getUsers = async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data;
};

// invite user
export const inviteUser = async (data: InviteUserPayload) => {
    const res = await api.post("/invite", data);
    return res.data;
};

// accept invite
export const acceptInvite = async (token: string) => {
    const res = await api.post("/invite/accept", { token });
    return res.data;
};

// update roles
export const updateUserRoles = async (
    userId: string,
    data: UpdateUserRolesPayload,
) => {
    const res = await api.patch(`/users/${userId}`, data);
    return res.data;
};

// delete user
export const deleteUser = async (userId: string) => {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
};
