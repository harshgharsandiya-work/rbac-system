"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { setAuthToken } from "@/lib/api/api";

export default function AuthInitializer() {
    const token = useAuthStore((s) => s.token);

    useEffect(() => {
        setAuthToken(token);
    }, [token]);

    return null;
}
