"use client";

import AuthGate from "@/components/AuthGate";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <AuthGate>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 p-6 lg:p-8 pt-16 lg:pt-8 overflow-x-hidden">
                    <div className="max-w-6xl mx-auto">{children}</div>
                </main>
            </div>
        </AuthGate>
    );
}
