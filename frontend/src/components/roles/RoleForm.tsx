"use client";

import { FormEvent, useState } from "react";
import PermissionSelector from "./PermissionSelector";
import { Plus } from "lucide-react";

interface RoleFormProps {
    allPermissions: string[];
    onCreate: (name: string, permissions: string[]) => Promise<void>;
}

export default function RoleForm({ allPermissions, onCreate }: RoleFormProps) {
    const [name, setName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!name) return;

        setLoading(true);
        await onCreate(name, selectedPermissions);
        setName("");
        setSelectedPermissions([]);
        setLoading(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4"
        >
            <h3 className="text-sm font-semibold text-gray-900">Create Role</h3>

            <input
                placeholder="Role name (e.g. EDITOR, VIEWER)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            />

            <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                    Assign permissions
                </p>
                <PermissionSelector
                    allPermissions={allPermissions}
                    selected={selectedPermissions}
                    onChange={setSelectedPermissions}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
                <Plus className="w-4 h-4" />
                {loading ? "Creating..." : "Create Role"}
            </button>
        </form>
    );
}
