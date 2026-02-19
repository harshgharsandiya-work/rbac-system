"use client";

import { Role, UpdateRolePayload } from "@/types/role";
import RoleRow from "@/components/roles/RoleRow";

interface RoleTableProps {
    roles: Role[];
    loading: boolean;
    allPermissions: string[];
    onUpdate: (id: string, data: UpdateRolePayload) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function RoleTable({
    roles,
    loading,
    allPermissions,
    onUpdate,
    onDelete,
}: RoleTableProps) {
    if (loading) {
        return <p className="text-gray-500">Loading...</p>;
    }

    if (roles.length === 0) {
        return <p className="text-gray-500">No roles found.</p>;
    }

    return (
        <div className="border rounded bg-white">
            <table className="w-full text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Permissions</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role) => (
                        <RoleRow
                            key={role.id}
                            role={role}
                            allPermissions={allPermissions}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
