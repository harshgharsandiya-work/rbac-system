"use client";

import PermissionGate from "@/components/PermissionGate";
import UserForm from "@/components/users/UserForm";
import UserTable from "@/components/users/UserTable";
import { useUsers } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";
import { Users } from "lucide-react";

export default function UserPage() {
    const { users, loading, handleInvite, handleUpdate, handleDelete } =
        useUsers();
    const { roles } = useRoles();

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            User Management
                        </h1>
                        <p className="text-sm text-gray-500">
                            Invite and manage organisation members
                        </p>
                    </div>
                </div>
            </div>

            <PermissionGate permission="user:create">
                <UserForm roles={roles} onInvite={handleInvite} />
            </PermissionGate>

            <PermissionGate permission="user:read">
                <UserTable
                    users={users}
                    roles={roles}
                    loading={loading}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            </PermissionGate>
        </div>
    );
}
