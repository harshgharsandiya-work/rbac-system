"use client";

import { Permission, UpdatePermissionPayload } from "@/types/permission";
import PermissionRow from "./PermissionRow";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { KeyRound } from "lucide-react";

interface PermissionTableProps {
    permissions: Permission[];
    loading: boolean;
    onUpdate: (id: string, data: UpdatePermissionPayload) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function PermissionTable({
    permissions,
    loading,
    onUpdate,
    onDelete,
}: PermissionTableProps) {
    if (loading) return <TableSkeleton rows={5} cols={3} />;

    if (permissions.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <KeyRound className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                    No permissions found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    Create a permission to get started
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Key
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {permissions.map((perm) => (
                        <PermissionRow
                            key={perm.id}
                            permission={perm}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
