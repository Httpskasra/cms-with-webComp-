/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useMemo, useState } from "react";

type KeyValue = { key: string; value: string };
type WebComponentStates = {
  hover: boolean;
  focus: boolean;
  disabled: boolean;
};

type WebComponentStylePayload = {
  cssVariables: Record<string, string>;
  tokens: Record<string, string>;
  variant: string;
  size: string;
  states: WebComponentStates;
};

function toPairs(record: Record<string, string>): KeyValue[] {
  return Object.entries(record ?? {}).map(([key, value]) => ({ key, value }));
}

function toRecord(pairs: KeyValue[]): Record<string, string> {
  return pairs
    .filter((pair) => pair.key.trim())
    .reduce<Record<string, string>>((acc, pair) => {
      acc[pair.key] = pair.value;
      return acc;
    }, {});
}

export default function WebComponentEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: componentId } = use(params);
  const isDev = process.env.NODE_ENV === "development";
  const [cssVars, setCssVars] = useState<KeyValue[]>([
    { key: "--cta-bg", value: "#4f46e5" },
    { key: "--cta-color", value: "#ffffff" },
  ]);
  const [tokens, setTokens] = useState<KeyValue[]>([
    { key: "primary.color", value: "#4f46e5" },
    { key: "text.muted", value: "#4b5563" },
  ]);
  const [variant, setVariant] = useState("primary");
  const [size, setSize] = useState("md");
  const [states, setStates] = useState<WebComponentStates>({
    hover: false,
    focus: false,
    disabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isDev) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
          const res = await fetch(
            `/api/admin/web-components/${componentId}/styles`
          );
        const data: WebComponentStylePayload = await res.json();
        if (cancelled) return;
        setCssVars(toPairs(data.cssVariables));
        setTokens(toPairs(data.tokens));
        setVariant(data.variant);
        setSize(data.size);
        setStates(data.states);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "unknown";
        setStatus(`خطا در بارگذاری استایل: ${message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [componentId, isDev]);

  const iframeHtml = useMemo(() => {
    if (!isDev) return "";

    const cssVariableLines = cssVars
      .filter((pair) => pair.key.trim())
      .map((pair) => `${pair.key}: ${pair.value};`)
      .join("\n");

    const tokenVariableLines = tokens
      .filter((pair) => pair.key.trim())
      .map(
        (pair) =>
          `--token-${pair.key.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}: ${
            pair.value
          };`
      )
      .join("\n");

    const variantClass = `variant-${variant}`;
    const sizeClass = `size-${size}`;
    const stateClass = [
      states.hover ? "state-hover" : "",
      states.focus ? "state-focus" : "",
      states.disabled ? "state-disabled" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `<!DOCTYPE html>
<html lang="fa">
  <head>
    <style>
      :root {
        ${cssVariableLines}
        ${tokenVariableLines}
      }
      body {
        margin: 0;
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        background: var(--surface, #f9fafb);
        color: #0f172a;
      }
      .preview-shell {
        padding: 16px;
      }
      .card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 18px;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
      }
      .sample-button {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        border-radius: 10px;
        border: 1px solid rgba(0,0,0,0.06);
        background: var(--cta-bg, #4f46e5);
        color: var(--cta-color, #fff);
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 600;
      }
      .sample-button.variant-secondary {
        background: var(--cta-secondary, #f97316);
        color: var(--cta-secondary-text, #111827);
      }
      .sample-button.variant-ghost {
        background: transparent;
        color: var(--cta-bg, #4f46e5);
        border-color: rgba(79, 70, 229, 0.35);
      }
      .sample-button.size-sm { padding: 8px 12px; font-size: 14px; }
      .sample-button.size-md { padding: 12px 16px; font-size: 15px; }
      .sample-button.size-lg { padding: 14px 20px; font-size: 16px; }
      .sample-button.state-hover { filter: brightness(1.07); transform: translateY(-1px); }
      .sample-button.state-focus { outline: 3px solid rgba(79, 70, 229, 0.35); outline-offset: 3px; }
      .sample-button.state-disabled { opacity: 0.55; pointer-events: none; }
      .pill {
        background: rgba(79,70,229,0.08);
        color: var(--token-text-muted, #475569);
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 12px;
      }
      .props {
        margin-top: 12px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px;
      }
      .props div { background: #f8fafc; padding: 10px; border-radius: 12px; }
    </style>
  </head>
  <body>
    <div class="preview-shell">
      <div class="card">
        <div class="pill">Dev Sandbox</div>
        <h2 style="margin:12px 0 6px">نمونه کامپوننت - ${componentId}</h2>
        <p style="margin:0 0 16px; color: var(--token-text-muted, #475569);">CTA web component همراه با props نمونه و استایل‌های inline.</p>
        <button class="sample-button ${variantClass} ${sizeClass} ${stateClass}">
          <span>Contact sales</span>
          <span style="font-size:14px; opacity:0.85;">→</span>
        </button>
        <div class="props">
          <div><strong>variant:</strong> ${variant}</div>
          <div><strong>size:</strong> ${size}</div>
          <div><strong>hover:</strong> ${states.hover}</div>
          <div><strong>focus:</strong> ${states.focus}</div>
          <div><strong>disabled:</strong> ${states.disabled}</div>
        </div>
      </div>
    </div>
  </body>
</html>`;
  }, [componentId, cssVars, isDev, size, states.disabled, states.focus, states.hover, tokens, variant]);

  async function handleSave() {
    if (!isDev) {
      setStatus("این بخش فقط در محیط توسعه فعال است.");
      return;
    }
    setStatus("در حال ذخیره...");
    const payload: WebComponentStylePayload = {
      cssVariables: toRecord(cssVars),
      tokens: toRecord(tokens),
      variant,
      size,
      states,
    };

    try {
      const res = await fetch(
        `/api/admin/web-components/${componentId}/styles`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.success) {
        setStatus("ذخیره شد و آماده انتشار است ✅");
      } else {
        setStatus("خطا در ذخیره");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "unknown";
      setStatus(`خطا: ${message}`);
    }
  }

  function updatePair(
    listSetter: (items: KeyValue[]) => void,
    list: KeyValue[],
    index: number,
    field: "key" | "value",
    value: string
  ) {
    const copy = [...list];
    copy[index] = { ...copy[index], [field]: value };
    listSetter(copy);
  }

  function addRow(listSetter: (items: KeyValue[]) => void, list: KeyValue[]) {
    listSetter([...list, { key: "", value: "" }]);
  }

  if (!isDev) {
    return (
      <main style={{ padding: 24 }}>
        <h1>وب‌کامپوننت {componentId}</h1>
        <p style={{ color: "#ef4444" }}>
          پیش‌نمایش و ادیت استایل فقط در محیط توسعه فعال است.
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h1 style={{ margin: 0 }}>Web Component Sandbox</h1>
        <span
          style={{
            background: "#fef3c7",
            color: "#92400e",
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
          }}
        >
          dev-only
        </span>
      </div>
      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          <section style={{ border: "1px solid #e5e7eb", borderRadius: 14 }}>
            <iframe
              title="preview sandbox"
              style={{ width: "100%", height: 430, border: "none", borderRadius: 14 }}
              sandbox="allow-same-origin"
              srcDoc={iframeHtml}
            />
          </section>

          <section
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <h2 style={{ margin: 0 }}>استایل و استیت</h2>
            <div>
              <label style={{ fontWeight: 600 }}>CSS Variables / Theme tokens</label>
              <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                {cssVars.map((pair, idx) => (
                  <div
                    key={`css-${idx}-${pair.key}`}
                    style={{ display: "flex", gap: 8 }}
                  >
                    <input
                      style={{ flex: 1 }}
                      placeholder="--variable"
                      value={pair.key}
                      onChange={(e) =>
                        updatePair(setCssVars, cssVars, idx, "key", e.target.value)
                      }
                    />
                    <input
                      style={{ flex: 1 }}
                      placeholder="#hex / token"
                      value={pair.value}
                      onChange={(e) =>
                        updatePair(setCssVars, cssVars, idx, "value", e.target.value)
                      }
                    />
                  </div>
                ))}
                <button onClick={() => addRow(setCssVars, cssVars)}>+ متغیر جدید</button>
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 600 }}>Theme tokens</label>
              <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                {tokens.map((pair, idx) => (
                  <div
                    key={`token-${idx}-${pair.key}`}
                    style={{ display: "flex", gap: 8 }}
                  >
                    <input
                      style={{ flex: 1 }}
                      placeholder="token.path"
                      value={pair.key}
                      onChange={(e) =>
                        updatePair(setTokens, tokens, idx, "key", e.target.value)
                      }
                    />
                    <input
                      style={{ flex: 1 }}
                      placeholder="مثلاً #4b5563"
                      value={pair.value}
                      onChange={(e) =>
                        updatePair(setTokens, tokens, idx, "value", e.target.value)
                      }
                    />
                  </div>
                ))}
                <button onClick={() => addRow(setTokens, tokens)}>+ توکن جدید</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label>Variant</label>
                <select
                  style={{ width: "100%", marginTop: 4 }}
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                >
                  <option value="primary">primary</option>
                  <option value="secondary">secondary</option>
                  <option value="ghost">ghost</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label>Size</label>
                <select
                  style={{ width: "100%", marginTop: 4 }}
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option value="sm">sm</option>
                  <option value="md">md</option>
                  <option value="lg">lg</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {([
                ["hover", "Hover"],
                ["focus", "Focus"],
                ["disabled", "Disabled"],
              ] as const).map(([key, label]) => (
                <label key={key} style={{ display: "flex", gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={states[key]}
                    onChange={(e) =>
                      setStates((prev) => ({ ...prev, [key]: e.target.checked }))
                    }
                  />
                  {label}
                </label>
              ))}
            </div>

            <button
              style={{ alignSelf: "flex-start", padding: "10px 16px" }}
              onClick={handleSave}
            >
              ذخیره و آماده‌سازی انتشار
            </button>
            {status && <p style={{ margin: 0 }}>{status}</p>}
          </section>
        </div>
      )}
    </main>
  );
}
