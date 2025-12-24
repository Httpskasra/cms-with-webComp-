/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/theme");
      const data = await res.json();
      setJsonText(JSON.stringify(data, null, 2));
    })();
  }, []);

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
      <div style={{ margin: "12px 0", padding: 12, border: "1px solid #e5e7eb" }}>
        <p style={{ marginTop: 0 }}>Sandbox جدید برای ویرایش وب‌کامپوننت:</p>
        <Link href="/admin/web-components/cti-footer">/admin/web-components/cti-footer</Link>
      </div>
      <textarea
        style={{ width: "100%", height: "400px", fontFamily: "monospace" }}
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={handleSave}>ذخیره</button>
        {status && <p>{status}</p>}
      </div>
    </main>
  );
}
