import React, { useMemo, useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { CTIInfoCard } from "../components/CTIInfoCard";

type Config = {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  styles?: {
    card?: React.CSSProperties;
    title?: React.CSSProperties;
    description?: React.CSSProperties;
    cta?: React.CSSProperties;
  };
};

function isInspectorEnabled(hostEl: HTMLElement) {
  // 1) امن‌ترین روش: attribute روی خود element
  const attr = hostEl.getAttribute("data-inspector");
  if (attr === "1" || attr === "true") return true;

  // 2) روش دوم (اختیاری): global flag روی window/globalThis
  const g: any = globalThis as any;
  if (g && g.__CTI_WC_DEV__ === true) return true;

  return false;
}

function safeParseConfig(raw: string | null): Config {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function safeStringifyConfig(cfg: Config) {
  try {
    return JSON.stringify(cfg);
  } catch {
    return "{}";
  }
}

function DevInspector({
  value,
  onChange,
}: {
  value: Config;
  onChange: (next: Config) => void;
}) {
  const inspectorRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 10, y: 10 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // شروع drag فقط وقتی روی دکمه کلیک شد
  const onDragMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
    const rect = inspectorRef.current!.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={inspectorRef}
      className="cti-dev-inspector"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}>
      <style>{`
        .cti-dev-inspector {
          position: absolute;
          width: min(360px, calc(100% - 20px));
          background: rgba(17,24,39,0.92);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 12px;
          z-index: 9999;
          backdrop-filter: blur(8px);
          user-select: none;
        }
        .cti-dev-inspector .drag-btn {
          all: unset;
          cursor: grab;
          padding: 4px 8px;
          background: rgba(255,255,255,0.12);
          border-radius: 6px;
          font-size: 12px;
          margin-left: 8px;
        }
        .cti-dev-inspector label { font-size: 11px; opacity: 0.8; margin-bottom: 4px; display: block; }
        .cti-dev-inspector input, .cti-dev-inspector textarea {
          width: 100%; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.08); color: #fff; padding: 9px 10px; outline: none; font-size: 12px;
        }
        .cti-dev-inspector textarea { min-height: 70px; resize: vertical; }
        .cti-dev-inspector .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .cti-dev-inspector .actions { display: flex; gap: 8px; margin-top: 10px; }
        .cti-dev-inspector button { all: unset; cursor: pointer; border-radius: 10px; padding: 9px 10px; font-size: 12px; font-weight: 800; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.10); flex: 1; text-align: center; }
        .cti-dev-inspector button:hover { opacity: 0.92; }
      `}</style>

      <div
        className="head"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <div>
          <div className="ttl">DEV Inspector: cti-info-card</div>
          <div className="hint">Use Drag button to move</div>
        </div>
        <button className="drag-btn" onMouseDown={onDragMouseDown}>
          Drag
        </button>
      </div>

      <div className="grid">
        <div>
          <label>Title</label>
          <input
            value={value.title ?? ""}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="Card title..."
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={value.description ?? ""}
            onChange={(e) =>
              onChange({ ...value, description: e.target.value })
            }
            placeholder="Card description..."
          />
        </div>

        <div className="row2">
          <div>
            <label>CTA Text</label>
            <input
              value={value.ctaText ?? ""}
              onChange={(e) => onChange({ ...value, ctaText: e.target.value })}
              placeholder="Learn more"
            />
          </div>
          <div>
            <label>CTA Href</label>
            <input
              value={value.ctaHref ?? ""}
              onChange={(e) => onChange({ ...value, ctaHref: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label>Card Background</label>
          <input
            type="color"
            value={(value.styles?.card?.backgroundColor as string) || "#ffffff"}
            onChange={(e) =>
              onChange({
                ...value,
                styles: {
                  ...value.styles,
                  card: {
                    ...value.styles?.card,
                    backgroundColor: e.target.value,
                  },
                },
              })
            }
          />
        </div>

        <div>
          <label>Title Color</label>
          <input
            type="color"
            value={(value.styles?.title?.color as string) || "#111827"}
            onChange={(e) =>
              onChange({
                ...value,
                styles: {
                  ...value.styles,
                  title: { ...value.styles?.title, color: e.target.value },
                },
              })
            }
          />
        </div>
      </div>

      <div className="actions">
        <button
          type="button"
          onClick={() =>
            onChange({
              title: "Info Card",
              description: "This is a reusable info card web component.",
              ctaText: "Learn more",
              ctaHref: "#",
              styles: {},
            })
          }>
          Reset
        </button>
      </div>
    </div>
  );
}

function InfoCardWithInspector({
  hostEl,
  initialConfig,
}: {
  hostEl: HTMLElement;
  initialConfig: Config;
}) {
  const [config, setConfig] = useState<Config>(initialConfig);

  const computed = useMemo(() => {
    return {
      title: config.title ?? "Info Card",
      description:
        config.description ?? "This is a reusable info card web component.",
      ctaText: config.ctaText ?? "Learn more",
      ctaHref: config.ctaHref ?? "#",
    };
  }, [config]);

  const [showInspectorFlag, setShowInspectorFlag] = useState(() =>
    isInspectorEnabled(hostEl)
  );

  useEffect(() => {
    if (showInspectorFlag) return;

    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (isInspectorEnabled(hostEl)) {
        setShowInspectorFlag(true);
        window.clearInterval(id);
      } else if (tries >= 20) {
        window.clearInterval(id);
      }
    }, 250);

    return () => window.clearInterval(id);
  }, [showInspectorFlag, hostEl]);

  // ✅ اضافه کردن state برای کنترل باز و بسته بودن inspector
  const [inspectorOpen, setInspectorOpen] = useState(false);

  useEffect(() => {
    if (showInspectorFlag) setInspectorOpen(true);
  }, [showInspectorFlag]);

  const updateConfig = (next: Config) => {
    setConfig(next);

    if (showInspectorFlag) {
      hostEl.setAttribute("data-config", safeStringifyConfig(next));
      hostEl.dispatchEvent(
        new CustomEvent("cti:config-change", { detail: next, bubbles: true })
      );
    }
  };

  return (
    <div className="cti-info-card-host">
      <style>{`
        .cti-info-card-host { position: relative; display: block; }
        .cti-toggle-btn {
          all: unset;
          cursor: pointer;
          user-select: none;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(0,0,0,0.2);
          background: rgba(255,255,255,0.1);
          position: absolute;
          right: 10px;
          top: 10px;
          z-index: 9999;
        }
      `}</style>

      <CTIInfoCard {...computed} styles={config.styles} />

      {showInspectorFlag && (
        <>
          <button
            className="cti-toggle-btn"
            onClick={() => setInspectorOpen((v) => !v)}>
            {inspectorOpen ? "Close Inspector" : "Open Inspector"}
          </button>

          {inspectorOpen && (
            <DevInspector value={config} onChange={updateConfig} />
          )}
        </>
      )}
    </div>
  );
}

class CTIInfoCardElement extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null;

  connectedCallback() {
    const container = document.createElement("div");
    this.appendChild(container);

    const initialConfig = safeParseConfig(this.getAttribute("data-config"));

    const root = createRoot(container);
    this.root = root;

    root.render(
      <InfoCardWithInspector hostEl={this} initialConfig={initialConfig} />
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
  }
}

customElements.define("cti-info-card", CTIInfoCardElement);
