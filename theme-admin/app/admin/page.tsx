/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";

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

export default function AdminPage() {
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState<string | null>(
    () =>
      process.env.NODE_ENV === "development"
        ? null
        : "این صفحه فقط در حالت توسعه فعال است."
  );
  const [notice, setNotice] = useState<Notice | null>(null);
  const [job, setJob] = useState<PublishJob | null>(null);
  const isDev = process.env.NODE_ENV === "development";
  const adminUser = "local-dev";

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
    <main style={{ padding: 24 }}>
      <h1>Theme Admin</h1>
      <p>فایل theme.json را ادیت کن (بدون دیتابیس، مستقیم روی فایل).</p>
      {notice && (
        <div
          style={{
            background: notice.type === "error" ? "#fdecea" : "#e8f4fd",
            color: "#111",
            padding: "8px 12px",
            marginBottom: 12,
            borderRadius: 4,
            border:
              notice.type === "error" ? "1px solid #f5c2c7" : "1px solid #b6d4fe",
          }}
        >
          {notice.text}
        </div>
      )}
      <textarea
        style={{ width: "100%", height: "400px", fontFamily: "monospace" }}
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={handleSave}>ذخیره</button>
        <button onClick={handlePublish} style={{ marginLeft: 8 }}>
          Publish & Purge
        </button>
        {status && <p>{status}</p>}
        {job && (
          <div style={{ marginTop: 8 }}>
            <strong>وضعیت job:</strong> {job.status}
            {job.message && <span style={{ marginLeft: 6 }}>({job.message})</span>}
            {job.error && (
              <p style={{ color: "#a00", marginTop: 4 }}>خطا: {job.error}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
