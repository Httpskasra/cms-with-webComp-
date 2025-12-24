// components/admin/TokenEditor.tsx

"use client";

import { useState } from "react";
import { ComponentRegistry } from "@/lib/manifestClient";

interface TokenEditorProps {
  component: ComponentRegistry;
  onChange: (tokens: Record<string, any>) => void;
}

export default function TokenEditor({ component, onChange }: TokenEditorProps) {
  const [tokens, setTokens] = useState<Record<string, string>>({});

  const handleChange = (varName: string, value: string) => {
    const updated = { ...tokens, [varName]: value };
    setTokens(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          CSS Variables / Design Tokens
        </h2>
        <p className="text-slate-600 mb-6">
          Edit the CSS custom properties below. Changes are reflected live in
          the preview.
        </p>

        <div className="bg-slate-50 rounded-lg p-6 space-y-4">
          {component.cssVars.map((variable) => (
            <div
              key={variable.name}
              className="border border-slate-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-slate-900">
                  {variable.name}
                </label>
                <span className="text-xs text-slate-500">
                  Type: {variable.type}
                </span>
              </div>

              {variable.description && (
                <p className="text-sm text-slate-600 mb-3">
                  {variable.description}
                </p>
              )}

              <div className="flex gap-3 items-center">
                {variable.type === "color" ? (
                  <>
                    <input
                      type="color"
                      value={tokens[variable.name] || variable.default}
                      onChange={(e) =>
                        handleChange(variable.name, e.target.value)
                      }
                      className="h-10 w-16 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={tokens[variable.name] || variable.default}
                      onChange={(e) =>
                        handleChange(variable.name, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder={variable.default}
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    value={tokens[variable.name] || variable.default}
                    onChange={(e) =>
                      handleChange(variable.name, e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder={variable.default}
                  />
                )}
              </div>

              <div className="text-xs text-slate-500 mt-2">
                Default: <code>{variable.default}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publish Button */}
      <div className="flex gap-3">
        <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
          Publish Changes
        </button>
        <button className="px-6 py-3 bg-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-300 transition-colors">
          Reset to Default
        </button>
      </div>
    </div>
  );
}
