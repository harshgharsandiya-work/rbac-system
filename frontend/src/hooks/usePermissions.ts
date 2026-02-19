import { useEffect, useState } from "react";
import {
    getPermissions,
    createPermission,
    updatePermission,
    deletePermission,
} from "@/lib/api/permission";
import { Permission, UpdatePermissionPayload } from "@/types/permission";
import toast from "react-hot-toast";

export function usePermissions() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);

    async function fetchPermissions() {
        try {
            setLoading(true);
            const data = await getPermissions();
            setPermissions(data);
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to fetch permission",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(key: string, description?: string) {
        try {
            const newPermission = await createPermission({ key, description });
            setPermissions((prev) => [...prev, newPermission]);
            toast.success("Permission created");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Permission create failed",
            );
        }
    }

    async function handleUpdate(
        permissionId: string,
        data: UpdatePermissionPayload,
    ) {
        try {
            const res = await updatePermission(permissionId, data);
            setPermissions((prev) =>
                prev.map((p) => (p.id == permissionId ? res.updated : p)),
            );

            toast.success("Permission updated");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Permission update failed",
            );
        }
    }

    async function handleDelete(permissionId: string) {
        try {
            await deletePermission(permissionId);
            setPermissions((prev) => prev.filter((p) => p.id != permissionId));
            toast.success("Permission deleted");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Permission delete failed",
            );
        }
    }

    useEffect(() => {
        fetchPermissions();
    }, []);

    return {
        permissions,
        loading,
        handleCreate,
        handleUpdate,
        handleDelete,
    };
}
