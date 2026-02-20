"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { acceptInvite } from "@/lib/api/user";

type Status = "idle" | "loading" | "success" | "error";

export default function AcceptInvitePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50"><Spinner /></div>
        }>
            <AcceptInviteContent />
        </Suspense>
    );
}

function AcceptInviteContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");

    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing invite token.");
            return;
        }

        handleAccept(token);
    }, [token]);

    async function handleAccept(inviteToken: string) {
        try {
            setStatus("loading");
            await acceptInvite(inviteToken);
            setStatus("success");
            setMessage("You've successfully joined the organisation.");

            setTimeout(() => {
                router.push("/dashboard");
            }, 2500);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setStatus("error");
            setMessage(
                err?.response?.data?.message ||
                    "This invite is invalid or has expired.",
            );
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white border rounded-xl shadow-sm p-8 max-w-md w-full text-center space-y-4">
                {status === "loading" && (
                    <>
                        <Spinner />
                        <h1 className="text-xl font-semibold text-gray-800">
                            Accepting invite...
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Please wait while we verify your invite.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">
                            Invite Accepted!
                        </h1>
                        <p className="text-gray-500 text-sm">{message}</p>
                        <p className="text-gray-400 text-xs">
                            Redirecting you to the dashboard...
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">
                            Invite Failed
                        </h1>
                        <p className="text-gray-500 text-sm">{message}</p>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="mt-2 bg-black text-white px-4 py-2 rounded text-sm"
                        >
                            Go to Dashboard
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function Spinner() {
    return (
        <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
    );
}
