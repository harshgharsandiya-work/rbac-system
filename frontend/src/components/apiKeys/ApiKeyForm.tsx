"use client";

import { FormEvent, useState } from "react";
import { Plus, KeyRound } from "lucide-react";

interface ApiKeyFormProps {
    onCreate: (name: string) => Promise<void>;
}

export default function ApiKeyForm({ onCreate }: ApiKeyFormProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!name) return;

        setLoading(true);
        await onCreate(name);
        setName("");
        setLoading(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4"
        >
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-primary-600" />
                Create API Key
            </h3>

            <input
                placeholder="Key name (e.g. Production Server)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
                <Plus className="w-4 h-4" />
                {loading ? "Creating..." : "Create Key"}
            </button>
        </form>
    );
}
