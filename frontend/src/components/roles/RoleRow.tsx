"use client";

import { Role, UpdateRolePayload } from "@/types/role";
import { useState, useEffect } from "react";
import PermissionGate from "@/components/PermissionGate";
import PermissionSelector from "@/components/roles/PermissionSelector";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Pencil, Trash2, Check, X, KeyRound } from "lucide-react";

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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        setData({ name: role.name, permissions: role.permissions });
    }, [role]);

    function handleChange<K extends keyof UpdateRolePayload>(
        field: K,
        value: UpdateRolePayload[K],
    ) {
        setData((prev) => ({ ...prev, [field]: value }));
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

    function handleCancelEdit() {
        setData({ name: role.name, permissions: role.permissions });
        setEditing(false);
    }

    return (
        <>
            <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                    {editing ? (
                        <input
                            value={data.name}
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                            className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-900">
                            {role.name}
                        </span>
                    )}
                </td>

                <td className="px-5 py-4">
                    {editing ? (
                        <PermissionSelector
                            allPermissions={allPermissions}
                            selected={data.permissions}
                            onChange={(permissions) =>
                                handleChange("permissions", permissions)
                            }
                        />
                    ) : (
                        <div className="flex flex-wrap gap-1.5">
                            {role.permissions.map((perm) => (
                                <span
                                    key={perm}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"
                                >
                                    <KeyRound className="w-2.5 h-2.5 opacity-50" />
                                    {perm}
                                </span>
                            ))}
                            {role.permissions.length === 0 && (
                                <span className="text-xs text-gray-400">
                                    No permissions
                                </span>
                            )}
                        </div>
                    )}
                </td>

                <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                        <PermissionGate permission="role:update">
                            {editing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                                        title="Save"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Cancel"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}
                        </PermissionGate>

                        <PermissionGate permission="role:delete">
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </PermissionGate>
                    </div>
                </td>
            </tr>

            <ConfirmModal
                open={showDeleteConfirm}
                title="Delete Role"
                message={`Are you sure you want to delete the "${role.name}" role? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={() => {
                    setShowDeleteConfirm(false);
                    onDelete(role.id);
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}
