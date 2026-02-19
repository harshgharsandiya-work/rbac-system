"use client";

import { useEffect, useState, FormEvent } from "react";
import {
    getOrganisation,
    updateOrganisation,
    Organisation,
} from "@/lib/api/organisation";
import { useAuthStore } from "@/store/auth.store";
import { Settings, Building2, Save, Globe } from "lucide-react";
import toast from "react-hot-toast";
import PermissionGate from "@/components/PermissionGate";
import { CardSkeleton } from "@/components/ui/Skeleton";
import OrgSwitchPage from "./switch/page";

export default function OrganisationPage() {
    const [org, setOrg] = useState<Organisation | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const organisationId = useAuthStore((s) => s.organisationId);
    const updateOrganisationName = useAuthStore(
        (s) => s.updateOrganisationName,
    );

    useEffect(() => {
        if (organisationId) {
            fetchOrg();
        }
    }, [organisationId]);

    async function fetchOrg() {
        try {
            setLoading(true);
            const data = await getOrganisation();
            setOrg(data);
            setName(data.name);
            setSlug(data.slug);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(
                err.response?.data?.message || "Failed to load organisation",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);

        try {
            await updateOrganisation({ name, slug });
            toast.success("Organisation updated");
            if (name) updateOrganisationName(name);
            await fetchOrg();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <Settings className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Organisation Settings
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage your workspace settings
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            ) : (
                <>
                    {/* Org Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <Building2 className="w-5 h-5 text-primary-500" />
                                <p className="text-sm font-medium text-gray-500">
                                    Organisation Name
                                </p>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                                {org?.name}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <Globe className="w-5 h-5 text-primary-500" />
                                <p className="text-sm font-medium text-gray-500">
                                    Slug
                                </p>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 font-mono">
                                {org?.slug}
                            </p>
                        </div>
                    </div>

                    {/* Update Form */}
                    <PermissionGate permission="organisation:update">
                        <form
                            onSubmit={handleUpdate}
                            className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">
                                Update Organisation
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Name
                                    </label>
                                    <input
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="w-full border border-gray-300 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Slug
                                    </label>
                                    <input
                                        value={slug}
                                        onChange={(e) =>
                                            setSlug(e.target.value)
                                        }
                                        className="w-full border border-gray-300 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow font-mono"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </PermissionGate>

                    {/* Org Details */}
                    {org && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">ID</span>
                                    <span className="text-gray-900 font-mono text-xs">
                                        {org.id}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">
                                        Status
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 rounded-lg text-xs font-medium ${org.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                                    >
                                        {org.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">
                                        Created
                                    </span>
                                    <span className="text-gray-900">
                                        {new Date(
                                            org.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">
                                        Updated
                                    </span>
                                    <span className="text-gray-900">
                                        {new Date(
                                            org.updatedAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
