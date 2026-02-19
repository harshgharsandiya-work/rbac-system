"use client";

import { Role } from "@/types/role";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
    roles: Role[];
    onInvite: (email: string, roleIds: string[]) => Promise<void>;
}

export default function UserForm({ roles, onInvite }: Props) {
    const [email, setEmail] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    function toggleRole(roleId: string) {
        setSelectedRoles((prev) =>
            prev.includes(roleId)
                ? prev.filter((r) => r !== roleId)
                : [...prev, roleId],
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email || selectedRoles.length === 0) {
            toast.error("Please enter email and select at least one role");
            return;
        }

        try {
            setLoading(true);
            await onInvite(email, selectedRoles);

            setEmail("");
            setSelectedRoles([]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border p-4 rounded bg-white space-y-4"
        >
            <input
                placeholder="User email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-3 py-2 rounded w-full"
            />

            <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        type="button"
                        onClick={() => toggleRole(role.id)}
                        className={`px-3 py-1 rounded border ${
                            selectedRoles.includes(role.id)
                                ? "bg-black text-white"
                                : ""
                        }`}
                    >
                        {role.name}
                    </button>
                ))}
            </div>

            <button
                className="bg-black text-white px-4 py-2 rounded"
                disabled={loading}
            >
                Invite User
            </button>
        </form>
    );
}
