"use client";

import PermissionGate from "@/components/PermissionGate";
import PermissionForm from "@/components/permissions/PermissionForm";
import PermissionTable from "@/components/permissions/PermissionTable";
import { usePermissions } from "@/hooks/usePermissions";
import { KeyRound } from "lucide-react";

export default function PermissionPage() {
    const { permissions, loading, handleCreate, handleUpdate, handleDelete } =
        usePermissions();

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Permission Management
                        </h1>
                        <p className="text-sm text-gray-500">
                            Define fine-grained permissions for your
                            organisation
                        </p>
                    </div>
                </div>
            </div>

            <PermissionGate permission="permission:create">
                <PermissionForm onCreate={handleCreate} />
            </PermissionGate>

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
