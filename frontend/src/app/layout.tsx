import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

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
            <body className="bg-gray-100 text-gray-900">
                {children}
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
