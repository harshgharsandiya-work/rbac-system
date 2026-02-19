"use client";

import ActionButton from "@/components/dashboard/ActionButton";
import StatCard from "@/components/dashboard/StatCard";
import PermissionGate from "@/components/PermissionGate";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import {
    Shield,
    KeyRound,
    Activity,
    UserPlus,
    Plus,
    Settings,
} from "lucide-react";

export default function DashboardHome() {
    const { roles, permissions, organisationName } = useAuthStore();
    const router = useRouter();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <section>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {organisationName}
                </h1>
                <p className="text-gray-500 mt-1">Welcome to your workspace</p>

                <div className="flex flex-wrap gap-2 mt-4">
                    {roles.map((role) => (
                        <span
                            key={role}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-lg border border-primary-100"
                        >
                            <Shield className="w-3 h-3" />
                            {role}
                        </span>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Your Roles"
                    value={roles.length}
                    icon={Shield}
                    color="indigo"
                />
                <StatCard
                    title="Your Permissions"
                    value={permissions.length}
                    icon={KeyRound}
                    color="violet"
                />
                <StatCard
                    title="Workspace Status"
                    value="Active"
                    icon={Activity}
                    color="emerald"
                />
            </section>

            {/* Quick Actions */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                </h2>
                <div className="flex flex-wrap gap-3">
                    <PermissionGate permission="user:create">
                        <ActionButton
                            label="Invite Member"
                            icon={UserPlus}
                            onClick={() => router.push("/dashboard/users")}
                        />
                    </PermissionGate>

                    <PermissionGate permission="permission:create">
                        <ActionButton
                            label="Create Permission"
                            icon={Plus}
                            onClick={() =>
                                router.push("/dashboard/permissions")
                            }
                        />
                    </PermissionGate>

                    <PermissionGate permission="role:create">
                        <ActionButton
                            label="Create Role"
                            icon={Shield}
                            onClick={() => router.push("/dashboard/roles")}
                        />
                    </PermissionGate>

                    <ActionButton
                        label="Organisation Settings"
                        icon={Settings}
                        onClick={() =>
                            router.push("/dashboard/organisation")
                        }
                    />
                </div>
            </section>

            {/* Permissions Preview */}
            {permissions.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Your Permissions
                    </h2>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                        <div className="flex flex-wrap gap-2">
                            {permissions.map((perm) => (
                                <span
                                    key={perm}
                                    className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-lg border border-gray-200"
                                >
                                    <KeyRound className="w-3 h-3 mr-1.5 text-gray-400" />
                                    {perm}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
