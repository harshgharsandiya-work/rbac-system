import Link from "next/link";
import {
    Shield,
    Users,
    Lock,
    Building2,
    ArrowRight,
    Layers,
    KeyRound,
} from "lucide-react";

const features = [
    {
        icon: Shield,
        title: "Role-Based Access",
        description:
            "Define granular roles with specific permissions for every team member.",
    },
    {
        icon: Building2,
        title: "Multi-Tenant",
        description:
            "Manage multiple organisations with isolated roles and permissions.",
    },
    {
        icon: Users,
        title: "Team Management",
        description:
            "Invite members, assign roles, and control access with ease.",
    },
    {
        icon: KeyRound,
        title: "Fine-Grained Permissions",
        description:
            "Create custom permission keys scoped to each organisation.",
    },
    {
        icon: Lock,
        title: "Secure Sessions",
        description:
            "JWT + server-side sessions with per-device tracking and revocation.",
    },
    {
        icon: Layers,
        title: "Organisation Switching",
        description:
            "Switch between workspaces seamlessly without re-authenticating.",
    },
];

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-40 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-primary-200 mb-8">
                        <Shield className="w-4 h-4" />
                        Enterprise-Grade Access Control
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        Identity & Access
                        <br />
                        <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
                            Management
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                        A multi-tenant RBAC platform to manage organisations,
                        roles, and permissions — all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg shadow-white/10"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Everything you need for
                        <span className="text-primary-600">
                            {" "}
                            access control
                        </span>
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Built for teams that need flexible, secure, and
                        scalable permission management.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group p-6 rounded-2xl border border-gray-200 bg-white hover:border-primary-200 hover:shadow-lg hover:shadow-primary-50 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-8">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                        <Shield className="w-5 h-5 text-primary-600" />
                        IAM Platform
                    </div>
                    <p className="text-sm text-gray-400">
                        Multi-Tenant RBAC Identity & Access Management
                    </p>
                </div>
            </footer>
        </main>
    );
}
