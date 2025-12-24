/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

type NoticeType = "info" | "success" | "error";

interface Notice {
  type: NoticeType;
  text: string;
}

interface PublishJob {
  id: string;
  status: "queued" | "running" | "completed" | "failed";
  message?: string;
  error?: string;
  component: string;
  requestedBy: string;
}

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
const adminUser = "local-dev";

const DocsTab = isDev
  ? dynamic<{ content: string }>(() => import("./DocsTab"), {
      ssr: false,
      loading: () => <p>در حال بارگذاری مستندات...</p>,
    })
  : null;

export default function AdminPage() {
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [job, setJob] = useState<PublishJob | null>(null);
  const [activeTabs, setActiveTabs] = useState<
    Record<string, "config" | "docs">
  >({});

  const applyJobUpdate = useCallback((nextJob: PublishJob) => {
    setJob(nextJob);
    if (nextJob.status === "completed") {
      setNotice({ type: "success", text: "انتشار با موفقیت انجام شد" });
    }
    if (nextJob.status === "failed") {
      setNotice({ type: "error", text: nextJob.error || "انتشار شکست خورد" });
    }
  }, []);

  useEffect(() => {
    if (!isDev) return;
    (async () => {
      const res = await fetch("/api/theme");
      if (!res.ok) {
        setNotice({ type: "error", text: "خطا در خواندن فایل theme" });
        return;
      }
      const data = await res.json();
      setJsonText(JSON.stringify(data, null, 2));
    })();
  }, [isDev]);

  useEffect(() => {
    if (!job || job.status === "completed" || job.status === "failed") return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/publish/${job.id}`);
      if (!res.ok) {
        setNotice({ type: "error", text: "خواندن وضعیت job ناموفق بود" });
        clearInterval(interval);
        return;
      }
      const data = await res.json();
      applyJobUpdate(data);
    }, 2000);

    return () => clearInterval(interval);
  }, [job, applyJobUpdate]);

  const { parsedTheme, parseError } = useMemo(() => {
    try {
      return {
        parsedTheme: JSON.parse(jsonText) as ParsedTheme,
        parseError: null,
      };
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
    if (!isDev) {
      setNotice({ type: "error", text: "تنها در حالت توسعه مجاز است" });
      return;
    }
    setStatus("در حال ذخیره...");
    try {
      const parsed = JSON.parse(jsonText); // اگر JSON اشتباه باشد خطا می‌دهد
      const res = await fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": adminUser,
        },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("ذخیره و انتشار آغاز شد ✅");
        if (data.job) {
          setJob(data.job);
          setNotice({ type: "info", text: data.job.message || "Job queued" });
        }
      } else setStatus("خطا در ذخیره ❌");
    } catch (e: any) {
      setStatus("JSON نامعتبر است: " + e.message);
    }
  }

  async function handlePublish() {
    if (!isDev) {
      setNotice({ type: "error", text: "تنها در حالت توسعه مجاز است" });
      return;
    }
    try {
      const parsed = JSON.parse(jsonText);
      setNotice({ type: "info", text: "در حال انتشار و پاکسازی CDN..." });
      const res = await fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": adminUser,
        },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (data.success) {
        setJob(data.job);
        setStatus("Job ایجاد شد");
      } else {
        setNotice({ type: "error", text: "انتشار ناموفق بود" });
      }
    } catch (error: any) {
      setNotice({ type: "error", text: "JSON نامعتبر: " + error.message });
    }
  }

  return (
    // <section>
    //   <h2>Theme Editor</h2>
    //   <p>فایل theme.json را ادیت کن (بدون دیتابیس، مستقیم روی فایل).</p>
    //   {notice && (
    //     <div
    //       style={{
    //         background: notice.type === "error" ? "#fdecea" : "#e8f4fd",
    //         color: "#111",
    //         padding: "8px 12px",
    //         marginBottom: 12,
    //         borderRadius: 4,
    //         border:
    //           notice.type === "error" ? "1px solid #f5c2c7" : "1px solid #b6d4fe",
    //       }}
    //     >
    //       {notice.text}
    //     </div>
    //   )}
    //   <div style={{ margin: "12px 0", padding: 12, border: "1px solid #e5e7eb" }}>
    //     <p style={{ marginTop: 0 }}>Sandbox جدید برای ویرایش وب‌کامپوننت:</p>
    //     <Link href="/admin/web-components/cti-footer">/admin/web-components/cti-footer</Link>
    //   </div>
    //   <textarea
    //     style={{ width: "100%", height: "400px", fontFamily: "monospace" }}
    //     value={jsonText}
    //     onChange={(e) => setJsonText(e.target.value)}
    //   />
    //   <div style={{ marginTop: 12 }}>
    //     <button onClick={handleSave}>ذخیره</button>
    //     <button onClick={handlePublish} style={{ marginLeft: 8 }}>
    //       Publish & Purge
    //     </button>
    //     {status && <p>{status}</p>}
    //     {job && (
    //       <div style={{ marginTop: 8 }}>
    //         <strong>وضعیت job:</strong> {job.status}
    //         {job.message && <span style={{ marginLeft: 6 }}>({job.message})</span>}
    //         {job.error && (
    //           <p style={{ color: "#a00", marginTop: 4 }}>خطا: {job.error}</p>
    //         )}
    //       </div>
    //     )}
    //     {parseError && (
    //       <p style={{ color: "#b91c1c" }}>JSON نامعتبر: {parseError}</p>
    //     )}
    //   </div>
    // </section>
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
            }}>
            <header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}>
              <strong>{name}</strong>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleTabChange(name, "config")}
                  disabled={selectedTab === "config"}>
                  تنظیمات
                </button>
                <button
                  onClick={() => handleTabChange(name, "docs")}
                  disabled={selectedTab === "docs"}>
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
                  }}>
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
    // </main>
  );
}
