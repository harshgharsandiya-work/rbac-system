import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
}

export default function ActionButton({ label, icon: Icon, onClick }: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-primary-300 hover:text-primary-600 hover:shadow-sm transition-all duration-200"
        >
            <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
            {label}
        </button>
    );
}
