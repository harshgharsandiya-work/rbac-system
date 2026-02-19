"use client";

import Link from "next/link";
import PermissionGate from "./PermissionGate";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const { email, organisationName, logout } = useAuthStore();
    const router = useRouter();

    async function handleLogout() {
        await logout();
        router.push("/");
    }

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col justify-between p-4">
            <div className="space-y-3">
                {/* Top */}
                <h2 className="text-xl font-semibold mb-6">
                    {organisationName ?? "Dashboard"}
                </h2>
                <nav className="space-y-3">
                    <div>
                        <Link href="/dashboard">Home</Link>
                    </div>

                    <PermissionGate permission="user:read">
                        <Link href="/dashboard/users">Users</Link>
                    </PermissionGate>

                    <PermissionGate permission="role:read">
                        <div className="mt-4">
                            <Link href="/dashboard/roles">Roles</Link>
                        </div>
                    </PermissionGate>

                    <PermissionGate permission="permission:read">
                        <div className="mt-4">
                            <Link href="/dashboard/permissions">
                                Permissions
                            </Link>
                        </div>
                    </PermissionGate>
                </nav>
            </div>

            {/* Bottom */}
            <div className="mt-8">
                <div className="border-t border-gray-700 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center uppercase">
                            {email?.[0]}
                        </div>
                        <div className="text-sm">
                            <p className="text-gray-400 text-xs">{email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}
