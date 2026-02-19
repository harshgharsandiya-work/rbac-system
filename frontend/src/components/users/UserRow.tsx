"use client";

import { Role } from "@/types/role";
import { User } from "@/types/user";
import { useState, useEffect } from "react";
import PermissionGate from "@/components/PermissionGate";
import { useAuthStore } from "@/store/auth.store";

interface UserRowProps {
    user: User;
    roles: Role[];
    onUpdate: (id: string, roleIds: string[]) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function UserRow({
    user,
    roles,
    onUpdate,
    onDelete,
}: UserRowProps) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const { email: currentEmail } = useAuthStore();
    const isSelf = currentEmail === user.email;
    const isOwner = user.role === "OWNER";

    const canModify = !isSelf && !isOwner;

    useEffect(() => {
        if (user.role) {
            const matchedRole = roles.find((r) => r.name === user.role);
            if (matchedRole) {
                setSelectedRoles([matchedRole.id]);
            }
        }
    }, [user, roles]);

    function handleRoleChange(roleId: string) {
        setSelectedRoles([roleId]); // single role (based on your backend response)
    }

    async function handleSave() {
        try {
            setLoading(true);
            await onUpdate(user.id, selectedRoles);
            setEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <tr>
            {/* Email */}
            <td className="p-3">{user.email}</td>

            {/* Role */}
            <td className="p-3">
                {editing ? (
                    <select
                        value={selectedRoles[0] || ""}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="">Select role</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                        {user.role}
                    </span>
                )}
            </td>

            {/* Actions */}
            <td className="p-3 space-x-3">
                <PermissionGate permission="user:update">
                    {canModify &&
                        (editing ? (
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
                                className="text-blue-600"
                            >
                                Edit
                            </button>
                        ))}
                </PermissionGate>

                <PermissionGate permission="user:delete">
                    {canModify && (
                        <button
                            onClick={() => onDelete(user.id)}
                            disabled={loading}
                            className="text-red-600 disabled:opacity-50"
                        >
                            Delete
                        </button>
                    )}
                </PermissionGate>
            </td>
        </tr>
    );
}
