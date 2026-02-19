"use client";

import { Role } from "@/types/role";
import { User } from "@/types/user";
import UserRow from "@/components/users/UserRow";

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
    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (users.length === 0)
        return <p className="text-gray-500">No users found.</p>;

    return (
        <div className="border rounded bg-white">
            <table className="w-full text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
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
