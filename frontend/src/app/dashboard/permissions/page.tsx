"use client";

import PermissionGate from "@/components/PermissionGate";
import PermissionForm from "@/components/permissions/PermissionForm";
import PermissionTable from "@/components/permissions/PermissionTable";
import { usePermissions } from "@/hooks/usePermissions";

export default function PermissionPage() {
    const { permissions, loading, handleCreate, handleUpdate, handleDelete } =
        usePermissions();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Permission Management</h1>

            {/* Create Permission */}
            <PermissionGate permission="permission:create">
                <PermissionForm onCreate={handleCreate} />
            </PermissionGate>

            {/* Read Permission */}
            <PermissionGate permission="permission:read">
                <PermissionTable
                    permissions={permissions}
                    loading={loading}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            </PermissionGate>
        </div>
    );
}
