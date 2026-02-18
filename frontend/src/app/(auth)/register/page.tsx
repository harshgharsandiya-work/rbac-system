"use client";

import { registerUser } from "@/lib/api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.target);

        try {
            const data = await registerUser({
                email: form.get("email") as string,
                password: form.get("password") as string,
            });

            toast.success(data.message || "Verify your email");

            // Redirect to OTP page
            router.push(`/verify-email?email=${data.email}`);
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Something went wrong",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-center text-3xl font-bold text-gray-800">
                Register Page
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
                {loading ? "Creating..." : "Register"}
            </button>

            <p className="text-center">
                Aldready have account?{" "}
                <Link href="/login" className="text-blue-500">
                    Sign In
                </Link>
            </p>
        </form>
    );
}
