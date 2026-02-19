"use client";

import { Permission, UpdatePermissionPayload } from "@/types/permission";
import PermissionRow from "./PermissionRow";

interface PermissionTableProps {
    permissions: Permission[];
    loading: boolean;
    onUpdate: (id: string, data: UpdatePermissionPayload) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function PermissionTable({
    permissions,
    loading,
    onUpdate,
    onDelete,
}: PermissionTableProps) {
    if (loading) {
        return <p className="text-gray-500">Loading...</p>;
    }

    if (permissions.length === 0) {
        return <p className="text-gray-500">No permissions found.</p>;
    }

    return (
        <div className="border rounded bg-white">
            <table className="w-full text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3">Key</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {permissions.map((perm) => (
                        <PermissionRow
                            key={perm.id}
                            permission={perm}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
