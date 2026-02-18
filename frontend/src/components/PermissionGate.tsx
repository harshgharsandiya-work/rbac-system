"use client";

import { useHasPermission } from "@/lib/permission";

interface PermissionGateProps {
    permission: string;
    children: any;
}

//to check if user has permission to access resources
export default function PermissionGate({
    permission,
    children,
}: PermissionGateProps) {
    const allowed = useHasPermission(permission);

    if (!allowed) return null;

    return children;
}
