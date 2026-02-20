"use client";

import { ApiKey } from "@/types/apiKey";
import { Trash2, ShieldOff } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PermissionGate from "@/components/PermissionGate";

interface ApiKeyRowProps {
    apiKey: ApiKey;
    onRevoke: (id: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function ApiKeyRow({
    apiKey,
    onRevoke,
    onDelete,
}: ApiKeyRowProps) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {apiKey.name}
                </td>

                <td className="px-5 py-4 text-sm text-gray-500">
                    {new Date(apiKey.createdAt).toLocaleDateString()}
                </td>

                <td className="px-5 py-4">
                    <span
                        className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                            apiKey.revoked
                                ? "bg-red-50 text-red-700"
                                : "bg-emerald-50 text-emerald-700"
                        }`}
                    >
                        {apiKey.revoked ? "Revoked" : "Active"}
                    </span>
                </td>

                <td className="px-5 py-4 flex items-center gap-2">
                    {!apiKey.revoked && (
                        <PermissionGate permission="api_key:revoke">
                            <button
                                onClick={() => onRevoke(apiKey.id)}
                                className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Revoke"
                            >
                                <ShieldOff className="w-4 h-4" />
                            </button>
                        </PermissionGate>
                    )}

                    <PermissionGate permission="api_key:delete">
                        <button
                            onClick={() => setShowDelete(true)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </PermissionGate>
                </td>
            </tr>

            <ConfirmModal
                open={showDelete}
                title="Delete API Key"
                message={`Delete "${apiKey.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={() => {
                    setShowDelete(false);
                    onDelete(apiKey.id);
                }}
                onCancel={() => setShowDelete(false)}
            />
        </>
    );
}
