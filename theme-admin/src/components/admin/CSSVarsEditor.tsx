// components/admin/CSSVarsEditor.tsx

"use client";

import { useEffect, useState } from "react";
import { ComponentRegistry } from "@/src/lib/manifestClient";

interface CSSVarsEditorProps {
  component: ComponentRegistry;
  iframeWindow?: Window | null;
}

export default function CSSVarsEditor({
  component,
  iframeWindow,
}: CSSVarsEditorProps) {
  const [cssVars, setCssVars] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";

  // Load current overrides on mount
  useEffect(() => {
    const loadOverrides = async () => {
      try {
        const res = await fetch(
          `${cdnUrl}/overrides/components/${component.id}.json`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setCssVars(data?.cssVars || {});
      } catch (err) {
        console.error("Failed to load overrides:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOverrides();
  }, [component.id, cdnUrl]);

  const handleVarChange = (varName: string, value: string) => {
    setCssVars((prev) => ({
      ...prev,
      [varName]: value,
    }));
  };

  const handleReset = async () => {
    if (!window.confirm("Clear all CSS variable overrides?")) return;

    try {
      setSaving(true);
      const res = await fetch(
        `${cdnUrl}/overrides/components/${component.id}.json`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cssVars: {} }),
        }
      );

      if (!res.ok) throw new Error("Failed to reset overrides");

      setCssVars({});
      setMessage({ type: "success", text: "✅ Overrides cleared" });

      // Notify iframe to refresh
      if (iframeWindow) {
        iframeWindow.postMessage(
          {
            type: "setCssVars",
            payload: { componentId: component.id, cssVars: {} },
          },
          "*"
        );
      }

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: `❌ ${err instanceof Error ? err.message : "Failed to reset"}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(
        `${cdnUrl}/overrides/components/${component.id}.json`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cssVars }),
        }
      );

      if (!res.ok) throw new Error("Failed to save overrides");

      setMessage({ type: "success", text: "✅ CSS variables saved" });

      // Notify iframe to update CSS vars without refresh
      if (iframeWindow) {
        iframeWindow.postMessage(
          {
            type: "setCssVars",
            payload: { componentId: component.id, cssVars },
          },
          "*"
        );
      }

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: `❌ ${err instanceof Error ? err.message : "Failed to save"}`,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-500">Loading...</div>;
  }

  const componentCssVars = component.cssVars || [];

  if (componentCssVars.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          No CSS variables defined for this component.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">🎨 CSS Variables</h3>
        {Object.keys(cssVars).length > 0 && (
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50">
            Clear All
          </button>
        )}
      </div>

      {message && (
        <div
          className={`p-3 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {componentCssVars.map((cssVar) => {
          const varName = cssVar.name || cssVar;
          const varValue = cssVars[varName] || "";
          const varDesc = cssVar.description || "";

          return (
            <div
              key={varName}
              className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-mono text-slate-700">
                  {varName}
                </label>
                {varDesc && (
                  <span className="text-xs text-slate-500 italic">
                    {varDesc}
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder={`e.g. #f3f4f6 or 16px`}
                value={varValue}
                onChange={(e) => handleVarChange(varName, e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition">
        {saving ? "Saving..." : "💾 Save CSS Variables"}
      </button>
    </div>
  );
}
