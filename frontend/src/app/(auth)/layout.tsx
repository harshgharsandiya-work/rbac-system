import { Shield } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            {/* Left panel - branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white p-12 flex-col justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold"
                >
                    <Shield className="w-7 h-7 text-primary-400" />
                    IAM Platform
                </Link>
                <div>
                    <h2 className="text-4xl font-bold mb-4">
                        Secure Access,
                        <br />
                        <span className="text-primary-400">
                            Simplified.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md">
                        Manage your organisations, roles, and permissions
                        with enterprise-grade security.
                    </p>
                </div>
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} IAM Platform
                </p>
            </div>

            {/* Right panel - form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 text-xl font-bold text-gray-900 mb-8 justify-center">
                        <Shield className="w-6 h-6 text-primary-600" />
                        IAM Platform
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
