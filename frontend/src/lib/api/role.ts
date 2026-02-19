import api from "./api";
import { Role, CreateRolePayload, UpdateRolePayload } from "../../types/role";

// get all roles per organisation
export const getRoles = async (): Promise<Role[]> => {
    const response = await api.get("/roles");
    return response.data;
};

// create role
export const createRole = async (data: CreateRolePayload) => {
    const response = await api.post("/roles", data);
    return response.data;
};

// update role
export const updateRole = async (roleId: string, data: UpdateRolePayload) => {
    const response = await api.patch(`/roles/${roleId}`, data);
    return response.data;
};

// delete role
export const deleteRole = async (roleId: string) => {
    const response = await api.delete(`/roles/${roleId}`);
    return response.data;
};
