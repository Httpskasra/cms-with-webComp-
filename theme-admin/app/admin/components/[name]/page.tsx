"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ComponentRegistry, getComponentById } from "@/lib/manifestClient";
import ComponentPreview from "@/components/admin/ComponentPreview";
import TokenEditor from "@/components/admin/TokenEditor";
import ComponentDocs from "@/components/admin/ComponentDocs";
import PublishTheme from "@/components/admin/PublishTheme";

type TabType = "preview" | "props" | "tokens" | "overrides" | "docs";

export default function ComponentEditorPage() {
  const params = useParams();
  const componentId = params.name as string;

  const [component, setComponent] = useState<ComponentRegistry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("preview");
  const [tokens, setTokens] = useState<Record<string, any>>({});
  const [props, setProps] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    getComponentById(componentId, true)
      .then((comp) => {
        if (!comp) throw new Error("Component not found");
        setComponent(comp);

        // Initialize props with defaults
        const initialProps: Record<string, any> = {};
        comp.props.forEach((prop) => {
          initialProps[prop.name] = prop.default;
        });
        setProps(initialProps);

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [componentId]);

  const handleTokensChange = (newTokens: Record<string, any>) => {
    setTokens(newTokens);
    setHasChanges(true);
  };

  const handlePublish = (versionId: string) => {
    // Reset changes flag after successful publish
    setHasChanges(false);
    console.log(`Published version: ${versionId}`);
  };

  if (loading) return <div className="p-8">Loading component...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!component)
    return <div className="p-8 text-red-600">Component not found</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {component.name}
            </h1>
            <p className="text-slate-600 mt-2">{component.description}</p>
            <p className="text-sm text-slate-500 font-mono mt-1">
              Component ID: {component.id} v{component.version}
            </p>
          </div>
          {hasChanges && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-900 font-semibold">
              ⚠️ Unsaved changes
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-300 mb-6 bg-white rounded-t-lg overflow-x-auto">
          {(["preview", "props", "tokens", "overrides", "docs"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-colors capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                {tab}
                {tab === "docs" && component.docs && " 🔒"}
              </button>
            )
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-lg shadow-md p-8">
          {activeTab === "preview" && (
            <ComponentPreview component={component} props={props} />
          )}

          {activeTab === "props" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Component Props</h2>
                <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                  {component.props.map((prop) => (
                    <div
                      key={prop.name}
                      className="border-b border-slate-200 pb-4 last:border-0">
                      <label className="block font-semibold text-slate-900 mb-2">
                        {prop.name}
                        <span className="text-xs text-slate-500 ml-2">
                          ({prop.type})
                        </span>
                      </label>
                      {prop.description && (
                        <p className="text-sm text-slate-600 mb-2">
                          {prop.description}
                        </p>
                      )}
                      <input
                        type="text"
                        value={props[prop.name] || ""}
                        onChange={(e) =>
                          setProps({
                            ...props,
                            [prop.name]: e.target.value,
                          })
                        }
                        placeholder={`Default: ${prop.default}`}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "tokens" && (
            <div className="space-y-6">
              <TokenEditor
                component={component}
                onChange={handleTokensChange}
              />

              {/* Publish Section */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-bold mb-4">Publish to CDN</h3>
                <PublishTheme
                  component={component}
                  tokens={tokens}
                  onPublish={handlePublish}
                  disabled={Object.keys(tokens).length === 0}
                />
              </div>
            </div>
          )}

          {activeTab === "overrides" && (
            <div className="text-center py-12 text-slate-500">
              <p className="mb-4 text-lg">CSS overrides editor coming soon</p>
              <p className="text-sm">
                Allow component-specific CSS customization
              </p>
            </div>
          )}

          {activeTab === "docs" && component.docs && (
            <ComponentDocs docs={component.docs} />
          )}

          {activeTab === "docs" && !component.docs && (
            <div className="text-center py-12 text-slate-500">
              <p>No documentation available for this component</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>
            🔒 Admin interface only. Documentation and edit tools never visible
            to clients.
          </p>
        </div>
      </div>
    </div>
  );
}
