"use client";

import { Role, UpdateRolePayload } from "@/types/role";
import { useState, useEffect } from "react";
import PermissionGate from "@/components/PermissionGate";
import PermissionSelector from "@/components/roles/PermissionSelector";

interface RoleRowProps {
    role: Role;
    allPermissions: string[];
    onUpdate: (id: string, data: UpdateRolePayload) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function RoleRow({
    role,
    allPermissions,
    onUpdate,
    onDelete,
}: RoleRowProps) {
    const [data, setData] = useState<UpdateRolePayload>({
        name: role.name,
        permissions: role.permissions,
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setData({
            name: role.name,
            permissions: role.permissions,
        });
    }, [role]);

    function handleChange<K extends keyof UpdateRolePayload>(
        field: K,
        value: UpdateRolePayload[K],
    ) {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleSave() {
        try {
            setLoading(true);
            await onUpdate(role.id, data);
            setEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <tr>
            {/* Role Name */}
            <td>
                {editing ? (
                    <input
                        value={data.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                ) : (
                    role.name
                )}
            </td>

            {/* Permissions */}
            <td>
                {editing ? (
                    <PermissionSelector
                        allPermissions={allPermissions}
                        selected={data.permissions}
                        onChange={(permissions) =>
                            handleChange("permissions", permissions)
                        }
                    />
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm) => (
                            <span
                                key={perm}
                                className="bg-gray-200 px-2 py-1 rounded text-sm"
                            >
                                {perm}
                            </span>
                        ))}
                    </div>
                )}
            </td>

            {/* Actions */}
            <td className="space-x-2">
                <PermissionGate permission="role:update">
                    {editing ? (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="text-green-600 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            disabled={loading}
                            className="text-blue-600"
                        >
                            Edit
                        </button>
                    )}
                </PermissionGate>

                <PermissionGate permission="role:delete">
                    <button
                        onClick={() => onDelete(role.id)}
                        className="text-green-600 disabled:opacity-50"
                    >
                        Delete
                    </button>
                </PermissionGate>
            </td>
        </tr>
    );
}
