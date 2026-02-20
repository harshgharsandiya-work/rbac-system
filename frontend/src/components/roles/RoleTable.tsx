"use client";

import { Role, UpdateRolePayload } from "@/types/role";
import RoleRow from "@/components/roles/RoleRow";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Shield } from "lucide-react";

interface RoleTableProps {
    roles: Role[];
    loading: boolean;
    allPermissions: string[];
    onUpdate: (id: string, data: UpdateRolePayload) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function RoleTable({
    roles,
    loading,
    allPermissions,
    onUpdate,
    onDelete,
}: RoleTableProps) {
    if (loading) return <TableSkeleton rows={4} cols={3} />;

    if (roles.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No roles found</p>
                <p className="text-gray-400 text-sm mt-1">
                    Create a role to get started
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
                            Name
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Permissions
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {roles.map((role) => (
                        <RoleRow
                            key={role.id}
                            role={role}
                            allPermissions={allPermissions}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
