//to check if user has permission to access resources

"use client";

import { useHasPermission } from "@/lib/permission";

interface PermissionGateProps {
    permission: string;
    children: any;
}

export default function PermissionGate({
    permission,
    children,
}: PermissionGateProps) {
    const allowed = useHasPermission(permission);

    if (!allowed) return null;

    return children;
}
