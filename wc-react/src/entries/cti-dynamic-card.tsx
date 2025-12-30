import React, { useMemo, useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { CTIDynamicCard } from "../components/CTIDynamicCard";

type Config = {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  badge?: string;
  styles?: {
    container?: React.CSSProperties;
    card?: React.CSSProperties;
    image?: React.CSSProperties;
    badge?: React.CSSProperties;
    title?: React.CSSProperties;
    subtitle?: React.CSSProperties;
    description?: React.CSSProperties;
    buttonsContainer?: React.CSSProperties;
    primaryButton?: React.CSSProperties;
    secondaryButton?: React.CSSProperties;
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

  const updateStyle = (
    section: keyof NonNullable<Config["styles"]>,
    property: string,
    val: string
  ) => {
    onChange({
      ...value,
      styles: {
        ...value.styles,
        [section]: {
          ...value.styles?.[section],
          [property]: val,
        },
      },
    });
  };

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
          width: min(420px, calc(100% - 20px));
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          background: rgba(17,24,39,0.95);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 16px;
          z-index: 9999;
          backdrop-filter: blur(8px);
          user-select: none;
        }
        .cti-dev-inspector .drag-btn {
          all: unset;
          cursor: grab;
          padding: 6px 10px;
          background: rgba(255,255,255,0.12);
          border-radius: 6px;
          font-size: 12px;
          margin-left: 8px;
        }
        .cti-dev-inspector label { 
          font-size: 11px; 
          opacity: 0.8; 
          margin-bottom: 4px; 
          display: block; 
          font-weight: 600;
        }
        .cti-dev-inspector input, 
        .cti-dev-inspector textarea {
          width: 100%; 
          border-radius: 8px; 
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.08); 
          color: #fff; 
          padding: 8px 10px; 
          outline: none; 
          font-size: 12px;
          box-sizing: border-box;
        }
        .cti-dev-inspector input:focus,
        .cti-dev-inspector textarea:focus {
          border-color: rgba(59, 130, 246, 0.5);
          background: rgba(255,255,255,0.12);
        }
        .cti-dev-inspector textarea { 
          min-height: 70px; 
          resize: vertical; 
        }
        .cti-dev-inspector .row2 { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 8px; 
        }
        .cti-dev-inspector .row3 { 
          display: grid; 
          grid-template-columns: 1fr 1fr 1fr; 
          gap: 8px; 
        }
        .cti-dev-inspector .actions { 
          display: flex; 
          gap: 8px; 
          margin-top: 12px; 
        }
        .cti-dev-inspector button { 
          all: unset; 
          cursor: pointer; 
          border-radius: 8px; 
          padding: 9px 12px; 
          font-size: 12px; 
          font-weight: 600; 
          border: 1px solid rgba(255,255,255,0.12); 
          background: rgba(255,255,255,0.10); 
          flex: 1; 
          text-align: center; 
          transition: all 0.2s;
        }
        .cti-dev-inspector button:hover { 
          opacity: 0.85; 
          background: rgba(255,255,255,0.15);
        }
        .cti-dev-inspector .section {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .cti-dev-inspector .section:last-child {
          border-bottom: none;
        }
        .cti-dev-inspector .section-title {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 12px;
          color: rgba(255,255,255,0.9);
        }
      `}</style>

      <div
        className="head"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}>
        <div>
          <div className="ttl" style={{ fontSize: "14px", fontWeight: 700 }}>
            DEV Inspector: cti-dynamic-card
          </div>
          <div className="hint" style={{ fontSize: "11px", opacity: 0.7 }}>
            Use Drag button to move
          </div>
        </div>
        <button className="drag-btn" onMouseDown={onDragMouseDown}>
          Drag
        </button>
      </div>

      <div className="grid">
        {/* Content Section */}
        <div className="section">
          <div className="section-title">Content</div>

          <div style={{ marginBottom: "12px" }}>
            <label>Title</label>
            <input
              value={value.title ?? ""}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
              placeholder="Card title..."
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Subtitle</label>
            <input
              value={value.subtitle ?? ""}
              onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
              placeholder="Card subtitle..."
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Description</label>
            <textarea
              value={value.description ?? ""}
              onChange={(e) =>
                onChange({ ...value, description: e.target.value })
              }
              placeholder="Card description..."
            />
          </div>

          <div className="row2" style={{ marginBottom: "12px" }}>
            <div>
              <label>Badge</label>
              <input
                value={value.badge ?? ""}
                onChange={(e) => onChange({ ...value, badge: e.target.value })}
                placeholder="New"
              />
            </div>
            <div>
              <label>Image URL</label>
              <input
                value={value.imageUrl ?? ""}
                onChange={(e) =>
                  onChange({ ...value, imageUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label>Image Alt Text</label>
            <input
              value={value.imageAlt ?? ""}
              onChange={(e) => onChange({ ...value, imageAlt: e.target.value })}
              placeholder="Image description"
            />
          </div>
        </div>

        {/* Buttons Section */}
        <div className="section">
          <div className="section-title">Buttons</div>

          <div className="row2" style={{ marginBottom: "12px" }}>
            <div>
              <label>Primary Button Text</label>
              <input
                value={value.primaryButtonText ?? ""}
                onChange={(e) =>
                  onChange({ ...value, primaryButtonText: e.target.value })
                }
                placeholder="Primary Action"
              />
            </div>
            <div>
              <label>Primary Button Href</label>
              <input
                value={value.primaryButtonHref ?? ""}
                onChange={(e) =>
                  onChange({ ...value, primaryButtonHref: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="row2">
            <div>
              <label>Secondary Button Text</label>
              <input
                value={value.secondaryButtonText ?? ""}
                onChange={(e) =>
                  onChange({ ...value, secondaryButtonText: e.target.value })
                }
                placeholder="Secondary Action"
              />
            </div>
            <div>
              <label>Secondary Button Href</label>
              <input
                value={value.secondaryButtonHref ?? ""}
                onChange={(e) =>
                  onChange({ ...value, secondaryButtonHref: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Styles Section */}
        <div className="section">
          <div className="section-title">Styles</div>

          <div style={{ marginBottom: "12px" }}>
            <label>Card Background</label>
            <input
              type="text"
              value={
                (value.styles?.card?.backgroundColor as string) || "#ffffff"
              }
              onChange={(e) =>
                updateStyle("card", "backgroundColor", e.target.value)
              }
            />
          </div>

          <div className="row2" style={{ marginBottom: "12px" }}>
            <div>
              <label>Title Color</label>
              <input
                type="text"
                value={(value.styles?.title?.color as string) || "#111827"}
                onChange={(e) => updateStyle("title", "color", e.target.value)}
              />
            </div>
            <div>
              <label>Subtitle Color</label>
              <input
                type="text"
                value={(value.styles?.subtitle?.color as string) || "#6b7280"}
                onChange={(e) =>
                  updateStyle("subtitle", "color", e.target.value)
                }
              />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Description Color</label>
            <input
              type="text"
              value={(value.styles?.description?.color as string) || "#4b5563"}
              onChange={(e) =>
                updateStyle("description", "color", e.target.value)
              }
            />
          </div>

          <div className="row2" style={{ marginBottom: "12px" }}>
            <div>
              <label>Primary Button Background</label>
              <input
                type="text"
                value={
                  (value.styles?.primaryButton?.backgroundColor as string) ||
                  "#3b82f6"
                }
                onChange={(e) =>
                  updateStyle(
                    "primaryButton",
                    "backgroundColor",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label>Primary Button Text Color</label>
              <input
                type="text"
                value={
                  (value.styles?.primaryButton?.color as string) || "#ffffff"
                }
                onChange={(e) =>
                  updateStyle("primaryButton", "color", e.target.value)
                }
              />
            </div>
          </div>

          <div className="row2">
            <div>
              <label>Secondary Button Background</label>
              <input
                type="text"
                value={
                  (value.styles?.secondaryButton?.backgroundColor as string) ||
                  "#e5e7eb"
                }
                onChange={(e) =>
                  updateStyle(
                    "secondaryButton",
                    "backgroundColor",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label>Secondary Button Text Color</label>
              <input
                type="text"
                value={
                  (value.styles?.secondaryButton?.color as string) || "#111827"
                }
                onChange={(e) =>
                  updateStyle("secondaryButton", "color", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <button
          type="button"
          onClick={() =>
            onChange({
              title: "Dynamic Card",
              subtitle: "Subtitle",
              description: "This is a fully dynamic card component.",
              primaryButtonText: "Primary Action",
              primaryButtonHref: "#",
              secondaryButtonText: "Secondary Action",
              secondaryButtonHref: "#",
              badge: "New",
              imageUrl: "",
              imageAlt: "Card image",
              styles: {},
            })
          }>
          Reset
        </button>
      </div>
    </div>
  );
}

function DynamicCardWithInspector({
  hostEl,
  initialConfig,
}: {
  hostEl: HTMLElement;
  initialConfig: Config;
}) {
  const [config, setConfig] = useState<Config>(initialConfig);
  const configRef = useRef<Config>(initialConfig);

  // Keep ref in sync with state
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Listen for external config changes (from CDN or admin)
  useEffect(() => {
    const handleConfigChange = (e: CustomEvent) => {
      if (e.detail && typeof e.detail === "object") {
        const newConfig = e.detail as Config;
        const currentConfigStr = JSON.stringify(configRef.current);
        const newConfigStr = JSON.stringify(newConfig);
        if (currentConfigStr !== newConfigStr) {
          setConfig(newConfig);
        }
      }
    };

    const handleAttributeChange = () => {
      const newConfig = safeParseConfig(hostEl.getAttribute("data-config"));
      const currentConfigStr = JSON.stringify(configRef.current);
      const newConfigStr = JSON.stringify(newConfig);
      if (currentConfigStr !== newConfigStr) {
        setConfig(newConfig);
      }
    };

    hostEl.addEventListener(
      "cti:config-change",
      handleConfigChange as EventListener
    );

    // Watch for attribute changes
    const observer = new MutationObserver(() => {
      handleAttributeChange();
    });

    observer.observe(hostEl, {
      attributes: true,
      attributeFilter: ["data-config"],
    });

    return () => {
      hostEl.removeEventListener(
        "cti:config-change",
        handleConfigChange as EventListener
      );
      observer.disconnect();
    };
  }, [hostEl]); // Remove config from dependencies to avoid infinite loop

  const computed = useMemo(() => {
    return {
      title: config.title ?? "Dynamic Card",
      subtitle: config.subtitle ?? "",
      description:
        config.description ??
        "This is a fully dynamic card component with customizable content and styles.",
      primaryButtonText: config.primaryButtonText ?? "Primary Action",
      primaryButtonHref: config.primaryButtonHref ?? "#",
      secondaryButtonText: config.secondaryButtonText ?? "Secondary Action",
      secondaryButtonHref: config.secondaryButtonHref ?? "#",
      imageUrl: config.imageUrl ?? "",
      imageAlt: config.imageAlt ?? "Card image",
      badge: config.badge ?? "",
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

  const updateConfig = async (next: Config) => {
    setConfig(next);

    if (showInspectorFlag) {
      hostEl.setAttribute("data-config", safeStringifyConfig(next));
      hostEl.dispatchEvent(
        new CustomEvent("cti:config-change", { detail: next, bubbles: true })
      );

      // ارسال پیام به parent window (برای site-preview)
      // ادمین این پیام را دریافت می‌کند و API call به CDN را انجام می‌دهد
      if (window.parent && window.parent !== window) {
        const componentId = hostEl.tagName.toLowerCase();
        window.parent.postMessage(
          {
            type: "configChanged",
            payload: { componentId, config: next },
          },
          "*"
        );
      }
    }
  };

  return (
    <div className="cti-dynamic-card-host">
      <style>{`
        .cti-dynamic-card-host { position: relative; display: block; }
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

      <CTIDynamicCard {...computed} styles={config.styles} />

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

class CTIDynamicCardElement extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null;

  static get observedAttributes() {
    return ["data-config"];
  }

  connectedCallback() {
    const container = document.createElement("div");
    this.appendChild(container);

    const initialConfig = safeParseConfig(this.getAttribute("data-config"));

    const root = createRoot(container);
    this.root = root;

    root.render(
      <DynamicCardWithInspector hostEl={this} initialConfig={initialConfig} />
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === "data-config" && this.root) {
      const newConfig = safeParseConfig(newValue);
      // Trigger re-render with new config
      this.root.render(
        <DynamicCardWithInspector hostEl={this} initialConfig={newConfig} />
      );
    }
  }
}

customElements.define("cti-dynamic-card", CTIDynamicCardElement);
