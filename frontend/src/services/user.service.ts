import api from "@/lib/api/api";
import { User } from "@/types/user";

export async function getUsers(): Promise<User[]> {
    const res = await api.get("/users");
    return res.data;
}

export async function addUser(email: string, roleNames: string[]) {
    return api.post("/users", { email, roleNames });
}

export async function updateUser(userId: string, roleNames: string[]) {
    return api.patch(`/users/${userId}`, { roleNames });
}

export async function deleteUser(userId: string) {
    return api.delete(`/users/${userId}`);
}
