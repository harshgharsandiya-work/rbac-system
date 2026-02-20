import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthInitializer from "@/components/AuthInitializer";

export const metadata: Metadata = {
    title: "IAM Platform",
    description: "Multi Organisation RBAC IAM Platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-gray-50 text-gray-900 antialiased">
                <AuthInitializer />
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            borderRadius: "12px",
                            background: "#1e293b",
                            color: "#f8fafc",
                            fontSize: "14px",
                        },
                    }}
                />
            </body>
        </html>
    );
}
