import api from "@/lib/api";
import { Role } from "@/types/role";

export async function getRoles(): Promise<Role[]> {
    const res = await api.get("/roles");
    return res.data;
}

export async function addRole(name: string, permissions: string[]) {
    return api.post("/roles", { name, permissions });
}

export async function updateRole(
    roleId: string,
    name: string,
    permissions: string[],
) {
    return api.patch(`/roles/${roleId}`, { name, permissions });
}

export async function deleteRole(roleId: string) {
    return api.delete(`/roles/${roleId}`);
}
