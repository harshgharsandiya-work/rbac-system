"use client";

import { verifyResetPassword } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    //get email param
    const email = searchParams.get("email");

    const handleVerify = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.target);

        try {
            const data = await verifyResetPassword({
                email: email as string,
                token: form.get("code") as string,
                newPassword: form.get("password") as string,
            });

            toast.success(data.message || "Password reset successfully");

            // redirect to login page after success
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch (error: any) {
            toast.error(
                error.response?.data?.error || "Invalid or expired code ",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-center text-3xl font-bold text-gray-800">
                Reset Password
            </p>

            <input
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6 digit code"
                className="w-full border px-3 py-2 rounded"
            />
            <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border px-3 py-2 rounded"
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded"
            >
                {loading ? "Resetting..." : "Reset"}
            </button>
        </form>
    );
}
