"use client";

import { useEffect } from "react";
import { useAuthStore } from "./auth.store";
import { setAuthToken } from "@/lib/api/api";

export default function AuthInitializer() {
    const { token } = useAuthStore();

    useEffect(() => {
        if (token) {
            setAuthToken(token);
        }
    }, [token]);
    return null;
}
