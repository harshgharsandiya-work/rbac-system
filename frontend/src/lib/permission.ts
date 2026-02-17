import { useAuthStore } from "@/store/auth.store";

export const useHasPermission = (key: string) => {
    const permissions = useAuthStore((s) => s.permissions);

    return permissions.includes(key);
};
