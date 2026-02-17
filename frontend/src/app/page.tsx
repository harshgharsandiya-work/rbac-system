import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold mb-4">IAM Platform</h1>
            <p className="text-gray-600 mb-6">
                Multi Organisation RBAC IAM Platform
            </p>

            <div className="flex gap-4">
                <Link
                    href="/register"
                    className="px-5 py-2 bg-black text-white rounded"
                >
                    Register
                </Link>
                <Link
                    href="/login"
                    className="px-5 py-2 bg-black text-white rounded"
                >
                    Login
                </Link>
            </div>
        </main>
    );
}
