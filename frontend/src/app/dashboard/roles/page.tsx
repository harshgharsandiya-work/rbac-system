"use client";

import PermissionGate from "@/components/PermissionGate";
import RoleForm from "@/components/roles/RoleForm";
import RoleTable from "@/components/roles/RoleTable";
import { usePermissions } from "@/hooks/usePermissions";
import { useRoles } from "@/hooks/useRoles";
import { Shield } from "lucide-react";

export default function RolePage() {
    const { roles, loading, handleCreate, handleUpdate, handleDelete } =
        useRoles();
    const { permissions } = usePermissions();
    const allPermissionKeys = permissions.map((p) => p.key);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Role Management
                        </h1>
                        <p className="text-sm text-gray-500">
                            Create and manage roles with specific permissions
                        </p>
                    </div>
                </div>
            </div>

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
