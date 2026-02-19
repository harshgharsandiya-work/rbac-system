"use client";

import PermissionGate from "@/components/PermissionGate";
import RoleForm from "@/components/roles/RoleForm";
import RoleTable from "@/components/roles/RoleTable";
import { usePermissions } from "@/hooks/usePermissions";
import { useRoles } from "@/hooks/useRoles";

export default function page() {
    const { roles, loading, handleCreate, handleUpdate, handleDelete } =
        useRoles();

    const { permissions } = usePermissions();
    const allPermissionKeys = permissions.map((p) => p.key);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Role Management</h1>

            <PermissionGate permission="role:create">
                <RoleForm
                    allPermissions={allPermissionKeys}
                    onCreate={handleCreate}
                />
            </PermissionGate>

            <PermissionGate permission="role:read">
                <RoleTable
                    roles={roles}
                    loading={loading}
                    allPermissions={allPermissionKeys}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            </PermissionGate>
        </div>
    );
}
