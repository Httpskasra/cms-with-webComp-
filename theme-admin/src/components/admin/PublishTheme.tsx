// components/admin/PublishTheme.tsx
// Button component for publishing theme changes to CDN

"use client";

import { useState } from "react";
import { ComponentRegistry } from "@/lib/manifestClient";
import { generateVersionId } from "@/lib/themeVersioning";

interface PublishThemeProps {
  component: ComponentRegistry;
  tokens: Record<string, string>;
  onPublish?: (versionId: string) => void;
  disabled?: boolean;
}

export default function PublishTheme({
  component,
  tokens,
  onPublish,
  disabled = false,
}: PublishThemeProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePublish = async () => {
    if (Object.keys(tokens).length === 0) {
      setError("No tokens to publish");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/theme/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componentId: component.id,
          tokens,
          description: `Theme update for ${component.name}`,
          env: process.env.NEXT_PUBLIC_ENV || "dev",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to publish theme");
      }

      const data = await response.json();
      setSuccess(
        `✅ Published! Version: ${data.version}\nCDN URL: ${data.url}`
      );

      if (onPublish) {
        onPublish(data.version);
      }

      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handlePublish}
        disabled={disabled || loading || Object.keys(tokens).length === 0}
        className={`w-full px-6 py-3 font-semibold rounded-lg transition-all ${
          disabled || loading || Object.keys(tokens).length === 0
            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
        }`}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span> Publishing...
          </span>
        ) : (
          "🚀 Publish to CDN"
        )}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800 whitespace-pre-line">
          {success}
        </div>
      )}
    </div>
  );
}
