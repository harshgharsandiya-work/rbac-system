"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGateProps {
    children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
    const token = useAuthStore((s) => s.token);
    const hasHydrated = useAuthStore((s) => s._hasHydrated);
    const router = useRouter();

    useEffect(() => {
        if (hasHydrated && !token) {
            router.replace("/login");
        }
    }, [token, hasHydrated, router]);

    if (!hasHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!token) return null;
    return <>{children}</>;
}
