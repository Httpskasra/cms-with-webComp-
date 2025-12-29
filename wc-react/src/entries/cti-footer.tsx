import React from "react";
import { createRoot } from "react-dom/client";
import { CTIFooter } from "../components/CTIFooter";

// 🎨 Dev override utility
async function applyDevOverrides(componentId: string, hostEl: HTMLElement) {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production")
    return;

  const cdnBase =
    (globalThis as any).__CTI_CDN_URL__ || "http://localhost:4000";
  const url = `${cdnBase}/overrides/components/${componentId}.json`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return;

    const data = await res.json();
    const cssVars = data?.cssVars || {};

    for (const [k, v] of Object.entries(cssVars)) {
      if (!k.startsWith("--")) continue;
      if (v === "" || v == null) hostEl.style.removeProperty(k);
      else hostEl.style.setProperty(k, String(v));
    }
  } catch {
    // ignore in dev
  }
}

class CTIFooterElement extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null;

  async connectedCallback() {
    const container = document.createElement("div");
    this.appendChild(container);

    const root = createRoot(container);
    this.root = root;

    root.render(
      <CTIFooter>{this.innerHTML && <>{this.innerHTML}</>}</CTIFooter>
    );

    // Apply dev overrides after mount
    await applyDevOverrides("cti-footer", this);
  }

  disconnectedCallback() {
    this.root?.unmount();
  }
}

customElements.define("cti-footer", CTIFooterElement);
