"use client";

import { Permission, UpdatePermissionPayload } from "@/types/permission";
import { useEffect, useState } from "react";
import PermissionGate from "@/components/PermissionGate";

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

    useEffect(() => {
        setData({
            key: permission.key,
            description: permission.description ?? "",
        });
    }, [permission]);

    function handleChange(field: keyof UpdatePermissionPayload, value: string) {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function handleSave() {
        onUpdate(permission.id, data);
        setEditing(false);
    }

    return (
        <tr>
            {/* Key */}
            <td>
                {editing ? (
                    <input
                        value={data.key ?? ""}
                        onChange={(e) => handleChange("key", e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                ) : (
                    permission.key
                )}
            </td>

            {/* Description */}
            <td>
                {editing ? (
                    <input
                        value={data.description ?? ""}
                        onChange={(e) =>
                            handleChange("description", e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                    />
                ) : (
                    permission.description
                )}
            </td>

            {/* Actions */}
            <td>
                <PermissionGate permission="permission:update">
                    {editing ? (
                        <button onClick={handleSave} className="text-green-600">
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="text-blue-600"
                        >
                            Edit
                        </button>
                    )}
                </PermissionGate>
                <PermissionGate permission="permission:delete">
                    <button
                        onClick={() => onDelete(permission.id)}
                        className="text-red-600"
                    >
                        Delete
                    </button>
                </PermissionGate>
            </td>
        </tr>
    );
}
