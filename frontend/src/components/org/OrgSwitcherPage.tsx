"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { createOrganisation } from "@/lib/api/organisation";
import { Building2, ArrowRight, Plus, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function OrgSwitchPage() {
    const {
        organisationId,
        organisations,
        switchingOrg,
        fetchOrganisations,
        switchOrg,
    } = useAuthStore();
    const router = useRouter();
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [newSlug, setNewSlug] = useState("");

    useEffect(() => {
        fetchOrganisations();
    }, [fetchOrganisations]);

    async function handleSwitch(orgId: string) {
        if (orgId === organisationId || switchingOrg) return;
        try {
            await switchOrg(orgId);
            toast.success("Switched organisation");
            router.push("/dashboard");
            router.refresh();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(
                err.response?.data?.message || "Failed to switch organisation",
            );
        }
    }

    async function handleCreate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!newName || !newSlug) return;

        setCreating(true);
        try {
            await createOrganisation({ name: newName, slug: newSlug });
            toast.success("Organisation created");
            setNewName("");
            setNewSlug("");
            setShowCreate(false);
            await fetchOrganisations();
        } catch (error: unknown) {
            const err = error as {
                response?: { data?: { message?: string; error?: string } };
            };
            toast.error(
                err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to create organisation",
            );
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Switch Organisation
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage and switch between your workspaces
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {organisations.map((org) => {
                    const isCurrent = org.id === organisationId;
                    return (
                        <button
                            key={org.id}
                            onClick={() => handleSwitch(org.id)}
                            disabled={isCurrent || switchingOrg}
                            className={`relative p-5 rounded-2xl border text-left transition-all duration-200 ${
                                isCurrent
                                    ? "border-primary-300 bg-primary-50 ring-1 ring-primary-200"
                                    : "border-gray-200 bg-white hover:border-primary-200 hover:shadow-md"
                            } disabled:cursor-default`}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                        isCurrent
                                            ? "bg-primary-500 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {org.name[0]?.toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p
                                        className={`font-semibold truncate ${
                                            isCurrent
                                                ? "text-primary-700"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {org.name}
                                    </p>
                                    <p className="text-xs text-gray-400 font-mono truncate mt-0.5">
                                        {org.slug}
                                    </p>
                                </div>
                                {isCurrent ? (
                                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                ) : (
                                    <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                                )}
                            </div>
                            {isCurrent && (
                                <span className="inline-block mt-3 text-[10px] font-semibold uppercase tracking-wider text-primary-600 bg-primary-100 px-2 py-0.5 rounded">
                                    Current
                                </span>
                            )}
                        </button>
                    );
                })}

                {/* Create new org card */}
                <button
                    onClick={() => setShowCreate(true)}
                    className="p-5 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-left hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-600 group-hover:text-primary-700 transition-colors">
                                New Organisation
                            </p>
                            <p className="text-xs text-gray-400">
                                Create a new workspace
                            </p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Create Organisation Form */}
            {showCreate && (
                <form
                    onSubmit={handleCreate}
                    className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 animate-fade-in"
                >
                    <h3 className="text-sm font-semibold text-gray-900">
                        Create Organisation
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Name
                            </label>
                            <input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="My Organisation"
                                required
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Slug
                            </label>
                            <input
                                value={newSlug}
                                onChange={(e) =>
                                    setNewSlug(
                                        e.target.value
                                            .toLowerCase()
                                            .replace(/[^a-z0-9-]/g, "-"),
                                    )
                                }
                                placeholder="my-organisation"
                                required
                                className="w-full border border-gray-300 px-4 py-2.5 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={creating}
                            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {creating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            {creating ? "Creating..." : "Create Organisation"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCreate(false);
                                setNewName("");
                                setNewSlug("");
                            }}
                            className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
