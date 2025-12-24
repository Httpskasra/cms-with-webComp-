"use client";

import { useEffect, useMemo, useState } from "react";
import type { WebComponentRecord } from "../../../src/lib/webComponentsRegistry";

const isDevOrFlagged =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_ADMIN_DEV === "true";

export default function ComponentsPage() {
  const [components, setComponents] = useState<WebComponentRecord[]>([]);
  const [selected, setSelected] = useState<WebComponentRecord | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isDevOrFlagged) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/web-components", { cache: "no-store" });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message || "Cannot load components");
        }
        const data = await res.json();
        setComponents(data.components || []);
        setSelected((prev) => prev || data.components?.[0] || null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return components;
    return components.filter((comp) => comp.name.toLowerCase().includes(term));
  }, [components, search]);

  if (!isDevOrFlagged) {
    return (
      <section>
        <h2>Components (dev only)</h2>
        <p>
          این بخش فقط در محیط توسعه یا زمانی که فلگ NEXT_PUBLIC_ADMIN_DEV=true تنظیم شده
          باشد نمایش داده می‌شود.
        </p>
      </section>
    );
  }

  return (
    <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Web Components</h2>
            <p style={{ margin: 0, color: "#444" }}>
              فهرست registry / CDN و نسخهٔ کش شده
            </p>
          </div>
          <input
            placeholder="جست‌وجو بر اساس نام"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px 10px", minWidth: 200 }}
          />
        </div>

        {loading && <p>در حال دریافت فهرست...</p>}
        {error && (
          <p style={{ color: "crimson" }}>
            خطا در دریافت داده‌ها: {error} (آیا registry در دسترس است؟)
          </p>
        )}

        {!loading && !error && (
          <div style={{ overflow: "auto", maxHeight: 420 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                  <th style={{ padding: "8px 6px" }}>Name</th>
                  <th style={{ padding: "8px 6px" }}>Version</th>
                  <th style={{ padding: "8px 6px" }}>Last Release</th>
                  <th style={{ padding: "8px 6px" }}>Cached</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((comp) => (
                  <tr
                    key={comp.name}
                    onClick={() => setSelected(comp)}
                    style={{
                      cursor: "pointer",
                      background:
                        selected?.name === comp.name ? "#f5f5f5" : "transparent",
                    }}
                  >
                    <td style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>
                      {comp.name}
                    </td>
                    <td style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>
                      {comp.version}
                    </td>
                    <td style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>
                      {comp.lastPublishedAt || "—"}
                    </td>
                    <td style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>
                      {comp.cachedVersion || "—"}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: 12, textAlign: "center" }}>
                      آیتمی مطابق جست‌وجو پیدا نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <aside
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          background: "#fafafa",
          minHeight: 240,
        }}
      >
        {selected ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0 }}>{selected.name}</h3>
                <p style={{ margin: 0, color: "#444" }}>
                  نسخه‌ی registry: {selected.version}
                </p>
              </div>
              {selected.cachedVersion && (
                <span
                  style={{
                    background: "#e2f3ff",
                    border: "1px solid #b9dfff",
                    padding: "4px 8px",
                    borderRadius: 6,
                    alignSelf: "flex-start",
                  }}
                >
                  Cache: {selected.cachedVersion}
                </span>
              )}
            </div>

            <p style={{ marginTop: 8, color: "#333" }}>
              آخرین انتشار: {selected.lastPublishedAt || "نامشخص"}
            </p>
            {selected.docs && (
              <details open style={{ marginBottom: 10 }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                  توضیحات کوتاه
                </summary>
                <p style={{ marginTop: 6 }}>{selected.docs}</p>
              </details>
            )}

            <details open>
              <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                متادیتا
              </summary>
              <pre
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  padding: 10,
                  borderRadius: 6,
                  overflow: "auto",
                }}
              >
                {JSON.stringify(selected.metadata || {}, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <p>برای مشاهده جزئیات، یک کامپوننت را از جدول انتخاب کنید.</p>
        )}
      </aside>
    </section>
  );
}
