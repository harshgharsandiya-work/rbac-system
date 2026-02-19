"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import PermissionGate from "./PermissionGate";
import { useAuthStore } from "@/store/auth.store";
import {
    Home,
    Users,
    Shield,
    KeyRound,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ArrowLeftRight,
} from "lucide-react";
import { useState } from "react";
import OrgSwitcher from "./OrgSwitcher";

const navItems = [
    {
        href: "/dashboard",
        label: "Home",
        icon: Home,
        permission: null,
        exact: true,
    },
    {
        href: "/dashboard/users",
        label: "Users",
        icon: Users,
        permission: "user:read",
    },
    {
        href: "/dashboard/roles",
        label: "Roles",
        icon: Shield,
        permission: "role:read",
    },
    {
        href: "/dashboard/permissions",
        label: "Permissions",
        icon: KeyRound,
        permission: "permission:read",
    },
    {
        href: "/dashboard/organisation",
        label: "Organisation",
        icon: Settings,
        permission: null,
        exact: true,
    },
    {
        href: "/dashboard/organisation/switch",
        label: "Switch Org",
        icon: ArrowLeftRight,
        permission: null,
    },
];

export default function Sidebar() {
    const { email, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    async function handleLogout() {
        await logout();
        router.push("/");
    }

    const isActive = (item: any) => {
        if (item.exact) {
            return pathname === item.href;
        }

        return pathname === item.href || pathname.startsWith(item.href + "/");
    };

    const navContent = (
        <>
            {/* Org Switcher */}
            <OrgSwitcher />

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 mt-2 space-y-1">
                {navItems.map((item) => {
                    const link = (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                isActive(item)
                                    ? "bg-primary-500/10 text-primary-400"
                                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                            }`}
                        >
                            <item.icon
                                className={`w-[18px] h-[18px] flex-shrink-0 ${
                                    isActive(item)
                                        ? "text-primary-400"
                                        : "text-gray-500 group-hover:text-gray-300"
                                }`}
                            />
                            {item.label}
                            {isActive(item) && (
                                <ChevronRight className="w-4 h-4 ml-auto text-primary-400" />
                            )}
                        </Link>
                    );

                    if (item.permission) {
                        return (
                            <PermissionGate
                                key={item.href}
                                permission={item.permission}
                            >
                                {link}
                            </PermissionGate>
                        );
                    }
                    return link;
                })}
            </nav>

            {/* User section */}
            <div className="p-3 mt-auto">
                <div className="border-t border-gray-800 pt-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold uppercase flex-shrink-0">
                            {email?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-200 truncate">
                                {email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2.5 mt-3 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-xl shadow-lg"
            >
                {mobileOpen ? (
                    <X className="w-5 h-5" />
                ) : (
                    <Menu className="w-5 h-5" />
                )}
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-gray-950 flex-col z-40">
                {navContent}
            </aside>

            {/* Mobile sidebar */}
            <aside
                className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-gray-950 z-50 flex flex-col transform transition-transform duration-300 ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {navContent}
            </aside>
        </>
    );
}
