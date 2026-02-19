"use client";

import { getRoles, createRole, updateRole, deleteRole } from "@/lib/api/role";
import { Role, UpdateRolePayload } from "@/types/role";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useRoles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    async function fetchRoles() {
        try {
            setLoading(true);
            const data = await getRoles();
            setRoles(data);
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to fetch roles",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(name: string, permissions: string[]) {
        try {
            const res = await createRole({ name, permissions });
            await fetchRoles();
            toast.success(res.message || "Role created");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Role create failed");
        }
    }

    async function handleUpdate(roleId: string, data: UpdateRolePayload) {
        try {
            await updateRole(roleId, data);
            await fetchRoles();
            toast.success("Role updated");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Role update failed");
        }
    }

    async function handleDelete(roleId: string) {
        try {
            await deleteRole(roleId);
            await fetchRoles();
            toast.success("Role deleted");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Role delete failed");
        }
    }

    useEffect(() => {
        fetchRoles();
    }, []);

    return {
        roles,
        loading,
        handleCreate,
        handleUpdate,
        handleDelete,
    };
}
