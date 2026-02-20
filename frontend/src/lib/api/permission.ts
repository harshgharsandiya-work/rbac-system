import api from "@/lib/api/api";
import {
    Permission,
    CreatePermissionPayload,
    UpdatePermissionPayload,
} from "../../types/permission";

//get all permissions per organisation
export const getPermissions = async (): Promise<Permission[]> => {
    const response = await api.get("/permissions");
    return response.data;
};

//create permission
export const createPermission = async (
    data: CreatePermissionPayload,
): Promise<Permission> => {
    const response = await api.post("/permissions", data);
    return response.data;
};

//update permission
export const updatePermission = async (
    permissionId: string,
    data: UpdatePermissionPayload,
) => {
    const response = await api.patch(`/permissions/${permissionId}`, data);
    return response.data;
};

//delete permission
export const deletePermission = async (permissionId: string) => {
    const response = await api.delete(`/permissions/${permissionId}`);
    return response.data;
};
