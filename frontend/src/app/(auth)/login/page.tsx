"use client";

import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const login = useAuthStore((s) => s.login);
    const router = useRouter();

    async function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.target);

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
                {loading ? "Logging..." : "Login"}
            </button>
        </form>
    );
}
