"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Building2, ChevronDown, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function OrgSwitcher() {
    const {
        organisationId,
        organisationName,
        organisations,
        switchingOrg,
        fetchOrganisations,
        switchOrg,
    } = useAuthStore();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchOrganisations();
    }, [fetchOrganisations]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleSwitch(orgId: string) {
        if (orgId === organisationId || switchingOrg) return;
        try {
            await switchOrg(orgId);
            setOpen(false);
            toast.success("Switched organisation");
            router.push("/dashboard");
            router.refresh();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to switch organisation");
        }
    }

    if (organisations.length <= 1) {
        return (
            <div className="px-4 pt-6 pb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">
                            {organisationName ?? "Dashboard"}
                        </p>
                        <p className="text-[11px] text-gray-500">IAM Platform</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 pt-6 pb-4 relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                disabled={switchingOrg}
                className="flex items-center gap-2.5 w-full rounded-xl hover:bg-white/5 p-1.5 -m-1.5 transition-colors"
            >
                <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
                    {switchingOrg ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                        <Building2 className="w-5 h-5 text-white" />
                    )}
                </div>
                <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-bold text-white truncate">
                        {organisationName ?? "Dashboard"}
                    </p>
                    <p className="text-[11px] text-gray-500">IAM Platform</p>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div className="absolute left-3 right-3 top-full mt-1 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50 py-1.5 max-h-64 overflow-y-auto animate-fade-in">
                    <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        Organisations
                    </p>
                    {organisations.map((org) => (
                        <button
                            key={org.id}
                            onClick={() => handleSwitch(org.id)}
                            className={`flex items-center gap-2.5 w-full px-3 py-2 text-left text-sm transition-colors ${
                                org.id === organisationId
                                    ? "text-primary-400 bg-primary-500/10"
                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                                    org.id === organisationId
                                        ? "bg-primary-500/20 text-primary-400"
                                        : "bg-gray-800 text-gray-400"
                                }`}
                            >
                                {org.name[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{org.name}</p>
                                <p className="text-[11px] text-gray-500 truncate">
                                    {org.slug}
                                </p>
                            </div>
                            {org.id === organisationId && (
                                <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
