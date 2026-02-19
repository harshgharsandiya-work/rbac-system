"use client";

import { useHasPermission } from "@/lib/permission";
import { ReactNode } from "react";

interface PermissionGateProps {
    permission: string;
    children: ReactNode;
}

export default function PermissionGate({
    permission,
    children,
}: PermissionGateProps) {
    const allowed = useHasPermission(permission);

    if (!allowed) return null;

    return <>{children}</>;
}
