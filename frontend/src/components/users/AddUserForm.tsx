"use client";

import { useState } from "react";
import PermissionGate from "../PermissionGate";

interface Role {
    id: string;
    name: string;
}

interface AddUserFormProps {
    roles: Role[];
    onAdd: (email: string, roles: string[]) => void;
}

export default function AddUserForm({ onAdd, roles }: AddUserFormProps) {
    const [email, setEmail] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const toggleRole = (roleName: string) => {
        setSelectedRoles((prev) =>
            prev.includes(roleName)
                ? prev.filter((r) => r !== roleName)
                : [...prev, roleName],
        );
    };

    const handleSubmit = async () => {
        if (!email || selectedRoles.length === 0) return;

        await onAdd(email, selectedRoles);

        setEmail("");
        setSelectedRoles([]);
    };

    return (
        <PermissionGate permission="user:create">
            <div className="border p-4 rounded space-y-4">
                <h2 className="font-semibold text-lg">Add User</h2>

                {/* Email */}
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="User email"
                    className="border px-3 py-2 rounded w-full"
                />

                {/* Selected Role as tags */}
                <div className="flex flex-wrap gap-2">
                    {selectedRoles.map((role) => (
                        <span
                            key={role}
                            onClick={() => toggleRole(role)}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm cursor-pointer"
                            title="Click to remove"
                        >
                            {role} X
                        </span>
                    ))}
                </div>

                {/* Role selector */}
                <div className="space-y-2">
                    <p className="text-sm text-gray-600">Select roles</p>

                    <div className="flex flex-wrap gap-2">
                        {roles.map((role) => {
                            const active = selectedRoles.includes(role.name);

                            return (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => toggleRole(role.name)}
                                    className={`px-3 py-1 rounded border text-sm ${
                                        active
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-700"
                                    }`}
                                >
                                    {role.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add User
                </button>
            </div>
        </PermissionGate>
    );
}
