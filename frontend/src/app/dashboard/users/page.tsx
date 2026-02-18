"use client";

import PermissionGate from "@/components/PermissionGate";
import AddUserForm from "@/components/users/AddUserForm";
import api from "@/lib/api/api";
import { getRoles } from "@/services/role.service";
import { getUsers, addUser } from "@/services/user.service";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const usersRes = await getUsers();
            const rolesRes = await getRoles();

            setUsers(usersRes);
            setRoles(rolesRes);
        };

        loadData();
    }, []);

    const handleAddUser = async (email: string, roleNames: string[]) => {
        await addUser(email, roleNames);

        //refresh user after add
        const updatedUsers = await getUsers();
        setUsers(updatedUsers);
    };
    return (
        <div>
            <h1>Users</h1>

            <ul>
                {users.map((u: any) => (
                    <li key={`${u.id}${u.role}`}>
                        {u.email} - {u.role}
                    </li>
                ))}
            </ul>

            {/* Add user buttton (permission based) */}
            <AddUserForm onAdd={handleAddUser} roles={roles} />

            {/* <PermissionGate permission="user:delete">
                <button className="bg-red-600 text-white px-4 py-2">
                    Delete user
                </button>
            </PermissionGate>

            <PermissionGate permission="user:update">
                <button className="bg-red-600 text-white px-4 py-2">
                    Update user
                </button>
            </PermissionGate> */}
        </div>
    );
}
