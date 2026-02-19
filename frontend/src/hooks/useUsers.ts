"use client";

import {
    getUsers,
    inviteUser,
    updateUserRoles,
    deleteUser,
} from "@/lib/api/user";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    async function fetchUsers() {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to fetch users",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleInvite(email: string, roleIds: string[]) {
        try {
            const res = await inviteUser({ email, roleIds });
            toast.success(res.message || "Invite sent");
            await fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invite failed");
        }
    }

    async function handleUpdate(userId: string, roleIds: string[]) {
        try {
            await updateUserRoles(userId, { roleIds });
            toast.success("User roles updated");
            await fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "User update failed");
        }
    }

    async function handleDelete(userId: string) {
        try {
            await deleteUser(userId);
            toast.success("User removed");
            await fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Delete failed");
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        handleInvite,
        handleUpdate,
        handleDelete,
    };
}
