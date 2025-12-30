/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ComponentRegistry, getComponentById } from "@/src/lib/manifestClient";
import TokenEditor from "@/src/components/admin/TokenEditor";
import CSSVarsEditor from "@/src/components/admin/CSSVarsEditor";
import ComponentDocs from "@/src/components/admin/ComponentDocs";
import PublishTheme from "@/src/components/admin/PublishTheme";

type TabType = "props" | "tokens" | "overrides" | "docs";

export default function SitePreviewAdminPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [component, setComponent] = useState<ComponentRegistry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overrides");
  const [props, setProps] = useState<Record<string, any>>({});
  const [tokens, setTokens] = useState<Record<string, any>>({});

  const clientUrl =
    process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";
  const clientOrigin = useMemo(() => new URL(clientUrl).origin, [clientUrl]);
  useEffect(() => setMounted(true), []);

  const iframeSrc = useMemo(() => {
    if (!mounted) return "";
    const adminOrigin =
      typeof window !== "undefined" ? window.location.origin : "";
    const url = new URL(clientUrl);
    url.searchParams.set("adminPreview", "1");
    if (adminOrigin) url.searchParams.set("adminOrigin", adminOrigin);
    return url.toString();
  }, [clientUrl, mounted]);

  const [componentConfig, setComponentConfig] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== clientOrigin) return;
      const data = event.data || {};
      if (data.type !== "componentSelected") return;
      const nextId = data.payload?.componentId;
      if (typeof nextId !== "string") return;
      setSelectedComponentId(nextId);
      setActiveTab("overrides");

      // Load config from CDN
      const loadConfig = async () => {
        try {
          const cdnUrl =
            process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
          const res = await fetch(`${cdnUrl}/config/components/${nextId}`, {
            cache: "no-store",
          });
          const data = await res.json();
          setComponentConfig(data?.config || {});
        } catch (err) {
          console.error("Failed to load config:", err);
          setComponentConfig({});
        }
      };
      loadConfig();
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [clientOrigin]);

  useEffect(() => {
    if (!selectedComponentId) {
      setComponent(null);
      setError(null);
      return;
    }

    setLoading(true);
    getComponentById(selectedComponentId, true)
      .then((comp) => {
        if (!comp) throw new Error("Component not found");
        setComponent(comp);

        const initialProps: Record<string, any> = {};
        comp.props.forEach((prop) => {
          initialProps[prop.name] = prop.default;
        });
        setProps(initialProps);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedComponentId]);

  useEffect(() => {
    if (!iframeLoaded || !selectedComponentId) return;
    const targetWindow = iframeRef.current?.contentWindow;
    if (!targetWindow) return;
    targetWindow.postMessage(
      {
        type: "setProps",
        payload: { componentId: selectedComponentId, props },
      },
      clientOrigin
    );
  }, [props, iframeLoaded, selectedComponentId, clientOrigin]);

  useEffect(() => {
    if (!iframeLoaded) return;
    const targetWindow = iframeRef.current?.contentWindow;
    if (!targetWindow) return;
    targetWindow.postMessage(
      { type: "setTokens", payload: tokens },
      clientOrigin
    );
  }, [tokens, iframeLoaded, clientOrigin]);

  useEffect(() => {
    if (!iframeLoaded) return;
    const targetWindow = iframeRef.current?.contentWindow;
    if (!targetWindow) return;
    targetWindow.postMessage(
      { type: "setWcDev", payload: { enabled: true } },
      clientOrigin
    );
  }, [iframeLoaded, clientOrigin]);

  // Send config to iframe when it changes
  useEffect(() => {
    if (
      !iframeLoaded ||
      !selectedComponentId ||
      Object.keys(componentConfig).length === 0
    )
      return;
    const targetWindow = iframeRef.current?.contentWindow;
    if (!targetWindow) return;
    targetWindow.postMessage(
      {
        type: "setConfig",
        payload: { componentId: selectedComponentId, config: componentConfig },
      },
      clientOrigin
    );
  }, [componentConfig, iframeLoaded, selectedComponentId, clientOrigin]);

  // Listen for config changes from iframe (from dev inspector)
  useEffect(() => {
    if (!iframeLoaded) return;

    const handleConfigChange = async (event: MessageEvent) => {
      if (event.origin !== clientOrigin) return;
      const data = event.data || {};
      if (data.type === "configChanged") {
        const { componentId, config } = data.payload || {};
        if (componentId === selectedComponentId && config) {
          setComponentConfig(config);

          // ارسال تغییرات به CDN از طریق ادمین
          try {
            const cdnUrl =
              process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
            await fetch(`${cdnUrl}/config/components/${componentId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ config }),
            });
            console.log(`✅ Config saved to CDN for component: ${componentId}`);
          } catch (err) {
            console.error("❌ Failed to save config to CDN:", err);
          }
        }
      }
    };

    window.addEventListener("message", handleConfigChange);
    return () => window.removeEventListener("message", handleConfigChange);
  }, [iframeLoaded, selectedComponentId, clientOrigin]);

  const handleTokensChange = (newTokens: Record<string, any>) => {
    setTokens(newTokens);
  };

  const handlePublish = (_versionId: string) => {
    setTokens({});
  };
  if (!mounted) return null; // یا Skeleton

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="px-6 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Live Site Inspector
          </h1>
          <p className="text-slate-600 mt-2">
            Click a component in the client site to open its dev panel.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 text-sm text-slate-600">
              Client Preview: {clientUrl}
            </div>
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              onLoad={() => setIframeLoaded(true)}
              className="w-full h-[80vh] border-0"
              title="Client Site Preview"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            {!selectedComponentId && (
              <div className="text-slate-500 text-sm">
                Click a component in the preview to load its dev tools.
              </div>
            )}

            {selectedComponentId && loading && (
              <div className="text-slate-500 text-sm">Loading component...</div>
            )}

            {selectedComponentId && error && (
              <div className="text-red-600 text-sm">Error: {error}</div>
            )}

            {component && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {component.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    {component.id}
                  </p>
                </div>

                <div className="flex border-b border-slate-200 overflow-x-auto">
                  {(["props", "tokens", "overrides", "docs"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-semibold capitalize whitespace-nowrap ${
                          activeTab === tab
                            ? "text-indigo-600 border-b-2 border-indigo-600"
                            : "text-slate-600 hover:text-slate-900"
                        }`}>
                        {tab}
                      </button>
                    )
                  )}
                </div>

                {activeTab === "props" && (
                  <div className="space-y-4">
                    {component.props.map((prop) => (
                      <div key={prop.name}>
                        <label className="block text-sm font-semibold text-slate-900 mb-1">
                          {prop.name}
                          <span className="text-xs text-slate-500 ml-2">
                            ({prop.type})
                          </span>
                        </label>
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
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "tokens" && (
                  <div className="space-y-6">
                    <TokenEditor
                      component={component}
                      onChange={handleTokensChange}
                    />
                    <div className="border-t pt-6">
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
                  <CSSVarsEditor
                    component={component}
                    iframeWindow={iframeRef.current?.contentWindow || null}
                  />
                )}

                {activeTab === "docs" && component.docs && (
                  <ComponentDocs docs={component.docs} />
                )}

                {activeTab === "docs" && !component.docs && (
                  <div className="text-sm text-slate-500">
                    No documentation available for this component.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
