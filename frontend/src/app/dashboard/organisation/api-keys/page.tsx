"use client";

import { useApiKeys } from "@/hooks/useApiKeys";
import ApiKeyForm from "@/components/apiKeys/ApiKeyForm";
import ApiKeyTable from "@/components/apiKeys/ApiKeyTable";
import PermissionGate from "@/components/PermissionGate";
import { KeyRound } from "lucide-react";
import RevealKeyModal from "@/components/apiKeys/RevealKeyModal";

export default function ApiKeysPage() {
    const {
        apiKeys,
        loading,
        newKey,
        clearNewKey,
        handleCreate,
        handleRevoke,
        handleDelete,
    } = useApiKeys();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        API Keys
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage machine access for this organisation
                    </p>
                </div>
            </div>

            <PermissionGate permission="api_key:create">
                <ApiKeyForm onCreate={handleCreate} />
            </PermissionGate>

            <ApiKeyTable
                apiKeys={apiKeys}
                loading={loading}
                onRevoke={handleRevoke}
                onDelete={handleDelete}
            />

            <RevealKeyModal
                open={!!newKey}
                apiKey={newKey?.key ?? ""}
                name={newKey?.name ?? null}
                onClose={clearNewKey}
            />
        </div>
    );
}
