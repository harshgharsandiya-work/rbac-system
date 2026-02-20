"use client";

import { verifyEmail } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
            <VerifyEmailForm />
        </Suspense>
    );
}

function VerifyEmailForm() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");

    const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            toast.error("Invalid request");
            return;
        }

        if (code.length !== 6) {
            toast.error("Please enter a valid 6-digit code");
            return;
        }

        setLoading(true);

        try {
            const data = await verifyEmail({ email, token: code });
            toast.success(data.message || "Email verified successfully");
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
                    <MailCheck className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Verify your email
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Enter the 6-digit code sent to
                    <br />
                    <span className="font-medium text-gray-700">{email}</span>
                </p>
            </div>

            <div>
                <input
                    type="text"
                    value={code}
                    onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={6}
                    placeholder="000000"
                    className="w-full border border-gray-300 px-4 py-3 rounded-xl text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Verifying..." : "Verify Email"}
            </button>
        </form>
    );
}
