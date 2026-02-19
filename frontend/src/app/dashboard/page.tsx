"use client";

import ActionButton from "@/components/dashboard/ActionButton";
import StatCard from "@/components/dashboard/StatCard";
import PermissionGate from "@/components/PermissionGate";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardHome() {
    const { roles, permissions, organisationName, organisationId } =
        useAuthStore();

    return (
        <div className="space-y-10">
            {/* Header */}
            <section>
                <h1 className="text-3xl font-bold">
                    <p className="text-xs text-gray-400 mt-2">
                        Organisation ID: {organisationId}
                    </p>
                    {organisationName}
                </h1>

                <div className="flex gap-2 mt-4">
                    {roles.map((role) => (
                        <span
                            key={role}
                            className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full"
                        >
                            {role}
                        </span>
                    ))}
                </div>
            </section>

            {/* Overview Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Your Roles" value={roles.length} />
                <StatCard title="Your Permissions" value={permissions.length} />
                <StatCard title="Workspace Status" value="Active" />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

                <div className="flex flex-wrap gap-4">
                    <PermissionGate permission="user:create">
                        <ActionButton label="Invite Member" />
                    </PermissionGate>

                    <PermissionGate permission="permission:create">
                        <ActionButton label="Create Permissions" />
                    </PermissionGate>

                    <PermissionGate permission="role:create">
                        <ActionButton label="Create Role" />
                    </PermissionGate>

                    <PermissionGate permission="organisation:update">
                        <ActionButton label="Update Organisation" />
                    </PermissionGate>
                </div>
            </section>
        </div>
    );
}
