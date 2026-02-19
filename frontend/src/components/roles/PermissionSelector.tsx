"use client";

// here permission stands for key of permission not permission object
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

    return (
        <div className="grid grid-cols-3 gap-2">
            {allPermissions.map((perm) => (
                <label key={perm} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={selected.includes(perm)}
                        onChange={() => togglePermission(perm)}
                    />
                    {perm}
                </label>
            ))}
        </div>
    );
}
