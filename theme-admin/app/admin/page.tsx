/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useState } from "react";

type ComponentConfig = {
  base?: Record<string, unknown>;
  variants?: Record<string, unknown>;
  className?: string;
  props?: Record<string, unknown>;
  docs?: string;
  notes?: string;
};

type ParsedTheme = {
  components?: Record<string, ComponentConfig>;
};

const isDev = process.env.NODE_ENV === "development";

const DocsTab = isDev
  ? dynamic<{ content: string }>(() => import("./DocsTab"), {
      ssr: false,
      loading: () => <p>در حال بارگذاری مستندات...</p>,
    })
  : null;

export default function AdminPage() {
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<
    Record<string, "config" | "docs">
  >({});

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/theme");
      const data = await res.json();
      setJsonText(JSON.stringify(data, null, 2));
    })();
  }, []);

  const { parsedTheme, parseError } = useMemo(() => {
    try {
      return { parsedTheme: JSON.parse(jsonText) as ParsedTheme, parseError: null };
    } catch (error: any) {
      return {
        parsedTheme: null,
        parseError: jsonText.trim() ? error.message : null,
      };
    }
  }, [jsonText]);

  const componentEntries = useMemo(
    () => Object.entries(parsedTheme?.components || {}),
    [parsedTheme?.components]
  );

  const handleTabChange = (name: string, tab: "config" | "docs") => {
    setActiveTabs((prev) => ({ ...prev, [name]: tab }));
  };

  async function handleSave() {
    setStatus("در حال ذخیره...");
    try {
      const parsed = JSON.parse(jsonText); // اگر JSON اشتباه باشد خطا می‌دهد
      const res = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (data.success) setStatus("ذخیره شد ✅");
      else setStatus("خطا در ذخیره ❌");
    } catch (e: any) {
      setStatus("JSON نامعتبر است: " + e.message);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Theme Admin</h1>
      <p>فایل theme.json را ادیت کن (بدون دیتابیس، مستقیم روی فایل).</p>
      <textarea
        style={{ width: "100%", height: "400px", fontFamily: "monospace" }}
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={handleSave}>ذخیره</button>
        {status && <p>{status}</p>}
        {parseError && (
          <p style={{ color: "#b91c1c" }}>JSON نامعتبر: {parseError}</p>
        )}
      </div>

      <section style={{ marginTop: 24 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>جزئیات کامپوننت‌ها</h2>
          {!isDev && (
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              (Docs فقط در حالت dev بارگذاری می‌شود تا در باندل prod نباشد)
            </span>
          )}
        </div>
        {componentEntries.length === 0 && (
          <p style={{ marginTop: 8 }}>
            کامپوننتی برای نمایش پیدا نشد یا JSON هنوز معتبر نیست.
          </p>
        )}
        {componentEntries.map(([name, config]) => {
          const selectedTab = activeTabs[name] ?? "config";
          const docsContent =
            typeof config.docs === "string"
              ? config.docs
              : config.docs
              ? JSON.stringify(config.docs, null, 2)
              : typeof config.notes === "string"
              ? config.notes
              : config.notes
              ? JSON.stringify(config.notes, null, 2)
              : "";
          const hasDocs = Boolean(docsContent);

          return (
            <article
              key={name}
              style={{
                marginTop: 12,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <header
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <strong>{name}</strong>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleTabChange(name, "config")}
                    disabled={selectedTab === "config"}
                  >
                    تنظیمات
                  </button>
                  <button
                    onClick={() => handleTabChange(name, "docs")}
                    disabled={selectedTab === "docs"}
                  >
                    Docs
                  </button>
                </div>
              </header>

              <div style={{ marginTop: 8 }}>
                {selectedTab === "config" && (
                  <pre
                    style={{
                      background: "#f8fafc",
                      padding: 12,
                      borderRadius: 6,
                      overflow: "auto",
                      margin: 0,
                    }}
                  >
                    {JSON.stringify(config, null, 2)}
                  </pre>
                )}

                {selectedTab === "docs" && (
                  <div>
                    {hasDocs ? (
                      isDev && DocsTab ? (
                        <Suspense fallback={<p>در حال بارگذاری مستندات...</p>}>
                          <DocsTab content={docsContent} />
                        </Suspense>
                      ) : (
                        <p>
                          Docs فقط در حالت توسعه بارگذاری می‌شود تا از bundle
                          production خارج بماند.
                        </p>
                      )
                    ) : (
                      <p>برای این کامپوننت توضیح مستنداتی ثبت نشده است.</p>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
