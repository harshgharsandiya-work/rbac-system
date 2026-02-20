"use client";

import { Role } from "@/types/role";
import { User } from "@/types/user";
import { useState, useEffect } from "react";
import PermissionGate from "@/components/PermissionGate";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAuthStore } from "@/store/auth.store";
import { Pencil, Trash2, Check, X } from "lucide-react";

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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        setSelectedRoles([roleId]);
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

    function handleCancelEdit() {
        const matchedRole = roles.find((r) => r.name === user.role);
        if (matchedRole) {
            setSelectedRoles([matchedRole.id]);
        }
        setEditing(false);
    }

    return (
        <>
            <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-violet-400 flex items-center justify-center text-white text-xs font-semibold uppercase flex-shrink-0">
                            {user.email[0]}
                        </div>
                        <span className="text-sm text-gray-900">
                            {user.email}
                        </span>
                        {isSelf && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-primary-50 text-primary-600 rounded font-medium">
                                You
                            </span>
                        )}
                    </div>
                </td>

                <td className="px-5 py-4">
                    {editing ? (
                        <select
                            value={selectedRoles[0] || ""}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Select role</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                                isOwner
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                        >
                            {user.role}
                        </span>
                    )}
                </td>

                <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                        <PermissionGate permission="user:update">
                            {canModify &&
                                (editing ? (
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
                                ))}
                        </PermissionGate>

                        <PermissionGate permission="user:delete">
                            {canModify && (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </PermissionGate>
                    </div>
                </td>
            </tr>

            <ConfirmModal
                open={showDeleteConfirm}
                title="Remove User"
                message={`Are you sure you want to remove ${user.email} from this organisation? This action cannot be undone.`}
                confirmLabel="Remove"
                onConfirm={() => {
                    setShowDeleteConfirm(false);
                    onDelete(user.id);
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}
