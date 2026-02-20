"use client";

import { useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";

interface RevealKeyModalProps {
    open: boolean;
    apiKey: string;
    name: string | null;
    onClose: () => void;
}

export default function RevealKeyModal({
    open,
    apiKey,
    name,
    onClose,
}: RevealKeyModalProps) {
    const [copied, setCopied] = useState(false);

    if (!open || !apiKey) return null;

    async function handleCopy() {
        await navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5 animate-fade-in">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            API Key Created
                        </h2>
                        <p className="text-xs text-gray-500">
                            Save this key securely. It won’t be shown again.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3">
                    <code className="text-sm font-mono break-all text-gray-800">
                        {apiKey}
                    </code>
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                        )}
                    </button>
                </div>

                <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    This key provides API access for this organisation. Store it
                    securely. If lost, create a new one.
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl text-sm font-medium transition"
                >
                    I’ve Saved It
                </button>
            </div>
        </div>
    );
}
