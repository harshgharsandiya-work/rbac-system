"use client";

import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: any) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
    );
}
