"use client";

import { Role } from "@/types/role";
import { User } from "@/types/user";
import UserRow from "@/components/users/UserRow";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Users } from "lucide-react";

interface Props {
    users: User[];
    roles: Role[];
    loading: boolean;
    onUpdate: (id: string, roleIds: string[]) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function UserTable({
    users,
    roles,
    loading,
    onUpdate,
    onDelete,
}: Props) {
    if (loading) return <TableSkeleton rows={4} cols={3} />;

    if (users.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No users found</p>
                <p className="text-gray-400 text-sm mt-1">
                    Invite members to get started
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
                            Email
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Role
                        </th>
                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <UserRow
                            key={`${user.id}${user.role}`}
                            user={user}
                            roles={roles}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
