"use client";

import { Role } from "@/types/role";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Mail, Send } from "lucide-react";

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

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
            className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4"
        >
            <h3 className="text-sm font-semibold text-gray-900">Invite User</h3>

            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    placeholder="User email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 pl-10 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                />
            </div>

            <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                    Assign roles
                </p>
                <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => toggleRole(role.id)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                selectedRoles.includes(role.id)
                                    ? "bg-primary-600 text-white border-primary-600"
                                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            {role.name}
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Send Invite"}
            </button>
        </form>
    );
}
