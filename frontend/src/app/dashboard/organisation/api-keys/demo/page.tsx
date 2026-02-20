"use client";

import { useState } from "react";
import { apiKeyDemo } from "@/lib/api/apiKeyDemo";
import { KeyRound, Send } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api/api";

export default function ApiKeyDemoPage() {
    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    async function handleTest() {
        if (!key) return;

        try {
            setLoading(true);
            const res = await apiKeyDemo(key);
            setResult(res);
            toast.success("API key is valid");
        } catch (error: any) {
            setResult(null);

            toast.error(
                error.response?.data?.message || "Invalid or expired API key",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        API Key Demo
                    </h1>
                    <p className="text-sm text-gray-500">
                        Test your API key against a protected endpoint
                    </p>
                </div>
            </div>

            {/* Input Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Paste API Key
                </label>

                <input
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="sk_live_..."
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <button
                    onClick={handleTest}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                    <Send className="w-4 h-4" />
                    {loading ? "Testing..." : "Test API Key"}
                </button>
            </div>

            {/* Result */}
            {result && (
                <div className="bg-gray-900 text-green-400 font-mono text-sm rounded-2xl p-5 overflow-auto">
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
