"use client";

import { KeyRound } from "lucide-react";

interface PermissionSelectorProps {
    allPermissions: string[];
    selected: string[];
    onChange: (permissions: string[]) => void;
}

export default function PermissionSelector({
    allPermissions,
    selected,
    onChange,
}: PermissionSelectorProps) {
    function togglePermission(key: string) {
        if (selected.includes(key)) {
            onChange(selected.filter((p) => p !== key));
        } else {
            onChange([...selected, key]);
        }
    }

    if (allPermissions.length === 0) {
        return (
            <p className="text-sm text-gray-400">No permissions available</p>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {allPermissions.map((perm) => (
                <label
                    key={perm}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-150 text-sm ${
                        selected.includes(perm)
                            ? "border-primary-300 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                >
                    <input
                        type="checkbox"
                        checked={selected.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="accent-primary-600 w-3.5 h-3.5"
                    />
                    <KeyRound className="w-3 h-3 flex-shrink-0 opacity-50" />
                    <span className="truncate">{perm}</span>
                </label>
            ))}
        </div>
    );
}
