"use client";

import PermissionGate from "@/components/PermissionGate";
import UserForm from "@/components/users/UserForm";
import UserTable from "@/components/users/UserTable";
import { useUsers } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";

export default function UserPage() {
    const { users, loading, handleInvite, handleUpdate, handleDelete } =
        useUsers();

    const { roles } = useRoles();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">User Management</h1>

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
