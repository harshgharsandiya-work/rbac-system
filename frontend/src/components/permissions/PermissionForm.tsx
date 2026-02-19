"use client";

import { useState } from "react";

interface PermissionFormProps {
    onCreate: (key: string, description?: string) => Promise<void>;
}

export default function PermissionForm({ onCreate }: PermissionFormProps) {
    const [key, setKey] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        if (!key) return;
        await onCreate(key, description);

        setKey("");
        setDescription("");
        setLoading(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex gap-3 border p-4 rounded bg-white"
        >
            <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="permission:key"
                className="border px-3 py-2 rounded w-1/3"
            />
            <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="border px-3 py-2 rounded w-1/3"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-4 rounded"
            >
                {loading ? "Creating..." : "Create"}
            </button>
        </form>
    );
}
