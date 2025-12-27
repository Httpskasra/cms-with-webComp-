/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function SiteAdminPage() {
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/site");
      const data = await res.json();
      setJsonText(JSON.stringify(data, null, 2));
    })();
  }, []);

  async function handleSave() {
    setStatus("در حال ذخیره...");
    try {
      const parsed = JSON.parse(jsonText); // اگر JSON اشتباه باشد خطا می‌دهد
      const res = await fetch("/api/site", {
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
      <h1>Site Admin</h1>
      <p>فایل site.json را ادیت کن (بدون دیتابیس، مستقیم روی فایل).</p>
      <textarea
        className="bg-gray-200"
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
