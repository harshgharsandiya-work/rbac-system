"use client";

import { verifyEmail } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    //get email param
    const email = searchParams.get("email");

    const handleVerify = async (e: any) => {
        e.preventDefault();

        if (!email) {
            toast.error("Invalid request");
            return;
        }

        if (code.length != 6) {
            toast.error("Please enter a valid 6-digit code");
            return;
        }

        setLoading(true);

        try {
            const data = await verifyEmail({
                email,
                token: code,
            });

            toast.success(data.message || "Email verified successfully");

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
                Verify your email
            </p>
            <p className="mb-4 text-sm text-gray-600 text-center">
                Enter 6 digit code to: <br />
                <span className="font-semibold">{email}</span>
            </p>
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                placeholder="Enter 6 digit code"
                className="w-full border px-3 py-2 rounded"
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded"
            >
                {loading ? "Verifying..." : "Verify"}
            </button>
        </form>
    );
}
