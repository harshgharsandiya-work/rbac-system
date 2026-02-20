"use client";

import { FormEvent, useState } from "react";
import { Plus, KeyRound, FileText } from "lucide-react";

interface PermissionFormProps {
    onCreate: (key: string, description?: string) => Promise<void>;
}

export default function PermissionForm({ onCreate }: PermissionFormProps) {
    const [key, setKey] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!key) return;

        setLoading(true);
        await onCreate(key, description || undefined);
        setKey("");
        setDescription("");
        setLoading(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4"
        >
            <h3 className="text-sm font-semibold text-gray-900">
                Create Permission
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="permission:key"
                        className="w-full border border-gray-300 pl-10 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                    />
                </div>
                <div className="relative flex-1">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full border border-gray-300 pl-10 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    {loading ? "Creating..." : "Create"}
                </button>
            </div>
        </form>
    );
}
