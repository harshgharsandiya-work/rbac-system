import { CreateRolePayload, Role } from "@/types/role";
import { useState } from "react";
import PermissionSelector from "./PermissionSelector";

interface RoleFormProps {
    allPermissions: string[];
    onCreate: (name: string, permissions: string[]) => Promise<void>;
}

export default function RoleForm({ allPermissions, onCreate }: RoleFormProps) {
    const [name, setName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        [],
    );

    function handleSubmit(e: any) {
        e.preventDefault();
        if (!name) return;

        onCreate(name, selectedPermissions);
        setName("");
        setSelectedPermissions([]);
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="border p-4 rounded space-y-4 bg-white"
        >
            <input
                placeholder="Role name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-3 py-2 rounded w-full"
            />

            <PermissionSelector
                allPermissions={allPermissions}
                selected={selectedPermissions}
                onChange={setSelectedPermissions}
            />

            <button className="bg-black text-white px-4 py-2 rounded">
                Create Role
            </button>
        </form>
    );
}
