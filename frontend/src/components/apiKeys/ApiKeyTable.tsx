"use client";

import { ApiKey } from "@/types/apiKey";
import ApiKeyRow from "./ApiKeyRow";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { KeyRound } from "lucide-react";

interface Props {
    apiKeys: ApiKey[];
    loading: boolean;
    onRevoke: (id: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function ApiKeyTable({
    apiKeys,
    loading,
    onRevoke,
    onDelete,
}: Props) {
    if (loading) return <TableSkeleton rows={4} cols={4} />;

    if (apiKeys.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <KeyRound className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No API keys created</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Name
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Created
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Status
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {apiKeys.map((key) => (
                        <ApiKeyRow
                            key={key.id}
                            apiKey={key}
                            onRevoke={onRevoke}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
