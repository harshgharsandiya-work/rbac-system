import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: "indigo" | "violet" | "emerald" | "amber";
}

const colorMap = {
    indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        icon: "bg-indigo-100 text-indigo-600",
    },
    violet: {
        bg: "bg-violet-50",
        text: "text-violet-600",
        icon: "bg-violet-100 text-violet-600",
    },
    emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        icon: "bg-emerald-100 text-emerald-600",
    },
    amber: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        icon: "bg-amber-100 text-amber-600",
    },
};

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
    const c = colorMap[color];

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className={`text-3xl font-bold mt-2 ${c.text}`}>{value}</p>
                </div>
                <div
                    className={`w-12 h-12 rounded-xl ${c.icon} flex items-center justify-center`}
                >
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
