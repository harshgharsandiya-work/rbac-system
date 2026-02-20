"use client";

import { registerUser } from "@/lib/api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { UserPlus, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.currentTarget);

        try {
            const data = await registerUser({
                email: form.get("email") as string,
                password: form.get("password") as string,
            });

            toast.success(data.message || "Verify your email");
            router.push(`/verify-email?email=${data.email}`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(
                err.response?.data?.message || "Something went wrong",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Create account
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Get started with your workspace
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="w-full border border-gray-300 pl-10 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="Create a strong password"
                            className="w-full border border-gray-300 pl-10 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    Sign In
                </Link>
            </p>
        </form>
    );
}
