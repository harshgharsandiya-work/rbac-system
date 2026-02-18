"use client";

import api from "@/lib/api/api";
import { loginUser } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const { login } = useAuthStore();
    const router = useRouter();

    async function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.target);

        try {
            const data = await loginUser({
                email: form.get("email") as string,
                password: form.get("password") as string,
            });

            login({
                email: data.email,
                token: data.token,
                roles: data.roles,
                permissions: data.permissions,
                organisationId: data.organisationId,
                organisationName: data.organisationName,
            });

            toast.success("Logged in successfully");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-center text-3xl font-bold text-gray-800">
                Login Page
            </p>
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

            <p className="text-right -mt-3 mb-2 text-gray-900">
                <Link href="/forgot-password">Forgot Password?</Link>
            </p>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded"
            >
                {loading ? "Logging..." : "Login"}
            </button>

            <p className="text-center">
                Don't have account?{" "}
                <Link href="/register" className="text-blue-500">
                    Sign Up
                </Link>
            </p>
        </form>
    );
}
