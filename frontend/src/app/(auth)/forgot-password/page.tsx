"use client";

import { forgotPassword } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.target);

        try {
            const data = await forgotPassword({
                email: form.get("email") as string,
            });

            toast.success(data.message || "OTP sent to your email");
            router.push(`/reset-password?email=${form.get("email")}`);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-center text-3xl font-bold text-gray-800">
                Forgot password
            </p>

            <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border px-3 py-2 rounded"
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded"
            >
                {loading ? "Sending..." : "Send OTP"}
            </button>
        </form>
    );
}
