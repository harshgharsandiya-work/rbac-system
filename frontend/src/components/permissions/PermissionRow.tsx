"use client";

import { Permission, UpdatePermissionPayload } from "@/types/permission";
import { useEffect, useState } from "react";
import PermissionGate from "@/components/PermissionGate";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Pencil, Trash2, Check, X } from "lucide-react";

interface PermissionRowProps {
    permission: Permission;
    onUpdate: (id: string, data: UpdatePermissionPayload) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function PermissionRow({
    permission,
    onUpdate,
    onDelete,
}: PermissionRowProps) {
    const [data, setData] = useState<UpdatePermissionPayload>({
        key: permission.key,
        description: permission.description ?? "",
    });
    const [editing, setEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        setData({
            key: permission.key,
            description: permission.description ?? "",
        });
    }, [permission]);

    function handleChange(field: keyof UpdatePermissionPayload, value: string) {
        setData((prev) => ({ ...prev, [field]: value }));
    }

    function handleSave() {
        onUpdate(permission.id, data);
        setEditing(false);
    }

    function handleCancelEdit() {
        setData({
            key: permission.key,
            description: permission.description ?? "",
        });
        setEditing(false);
    }

    return (
        <>
            <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                    {editing ? (
                        <input
                            value={data.key ?? ""}
                            onChange={(e) =>
                                handleChange("key", e.target.value)
                            }
                            className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    ) : (
                        <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                            {permission.key}
                        </span>
                    )}
                </td>

                <td className="px-5 py-4">
                    {editing ? (
                        <input
                            value={data.description ?? ""}
                            onChange={(e) =>
                                handleChange("description", e.target.value)
                            }
                            className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    ) : (
                        <span className="text-sm text-gray-500">
                            {permission.description || (
                                <span className="text-gray-300 italic">
                                    No description
                                </span>
                            )}
                        </span>
                    )}
                </td>

                <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                        <PermissionGate permission="permission:update">
                            {editing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
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

                        <PermissionGate permission="permission:delete">
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
                title="Delete Permission"
                message={`Are you sure you want to delete "${permission.key}"? Make sure it's not assigned to any roles first.`}
                confirmLabel="Delete"
                onConfirm={() => {
                    setShowDeleteConfirm(false);
                    onDelete(permission.id);
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}
