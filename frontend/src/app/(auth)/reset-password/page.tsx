"use client";

import { verifyResetPassword } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, Lock, Hash } from "lucide-react";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}

function ResetPasswordForm() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");

    const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.currentTarget);

        try {
            const data = await verifyResetPassword({
                email: email as string,
                token: form.get("code") as string,
                newPassword: form.get("password") as string,
            });

            toast.success(data.message || "Password reset successfully");
            setTimeout(() => router.push("/login"), 1000);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(
                err.response?.data?.error || "Invalid or expired code",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleVerify} className="space-y-5">
            <div className="text-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Reset Password
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Enter your reset code and new password
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Reset Code
                    </label>
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            name="code"
                            required
                            placeholder="Enter 6-digit code"
                            className="w-full border border-gray-300 pl-10 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Enter new password"
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
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );
}
