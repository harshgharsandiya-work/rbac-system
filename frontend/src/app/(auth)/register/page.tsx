"use client";

import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const login = useAuthStore((s) => s.login);

    async function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.target);

        await api.post("/auth/register", {
            email: form.get("email"),
            password: form.get("password"),
        });

        const res = await api.post("/auth/login", {
            email: form.get("email"),
            password: form.get("password"),
        });

        const data = res.data;

        login({
            email: data.email,
            token: data.token,
            roles: data.roles,
            permissions: data.permissions,
            organisationId: data.organisationId,
            organisationName: data.organisationName,
        });
        // await registerAction(formData);

        setLoading(false);
        router.push("/dashboard");
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                name="email"
                placeholder="Email"
                className="w-full border px-3 py-2 rounded"
            />
            <input
                name="password"
                placeholder="Password"
                type="password"
                className="w-full border px-3 py-2 rounded"
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded"
            >
                {loading ? "Creating..." : "Register"}
            </button>
        </form>
    );
}
