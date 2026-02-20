"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import {
    getUserApiKeys,
    createApiKey,
    revokeApiKey,
    deleteApiKey,
} from "@/lib/api/apiKey";
import { ApiKey, CreateApiKeyPayload } from "@/types/apiKey";

export function useApiKeys() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(false);
    const [newKey, setNewKey] = useState<{ key: string; name: string } | null>(
        null,
    );
    const { organisationId } = useAuthStore();

    // fetch API keys for current user
    async function fetchApiKeys() {
        try {
            setLoading(true);
            const data = await getUserApiKeys();
            setApiKeys(data);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(
                err.response?.data?.message || "Failed to fetch API keys",
            );
        } finally {
            setLoading(false);
        }
    }

    // create new API key
    async function handleCreate(name: string) {
        try {
            const payload: CreateApiKeyPayload = { name };
            const res = await createApiKey(payload);
            await fetchApiKeys();
            setNewKey({ key: res.key, name: res.name });
            toast.success(`API key "${res.name}" created`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(
                err.response?.data?.message || "API key creation failed",
            );
        }
    }

    function clearNewKey() {
        setNewKey(null);
    }

    // revoke an API key
    async function handleRevoke(id: string) {
        try {
            await revokeApiKey(id);
            await fetchApiKeys();
            toast.success("API key revoked");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(
                err.response?.data?.message || "Failed to revoke API key",
            );
        }
    }

    // delete an API key
    async function handleDelete(id: string) {
        try {
            await deleteApiKey(id);
            await fetchApiKeys();
            toast.success("API key deleted");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(
                err.response?.data?.message || "Failed to delete API key",
            );
        }
    }

    useEffect(() => {
        if (organisationId) {
            fetchApiKeys();
        }
    }, [organisationId]);

    return {
        apiKeys,
        loading,
        newKey,
        clearNewKey,
        handleCreate,
        handleRevoke,
        handleDelete,
    };
}
