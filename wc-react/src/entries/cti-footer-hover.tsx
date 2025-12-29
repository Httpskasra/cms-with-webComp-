import React from "react";
import { createRoot } from "react-dom/client";
import { CTIFooterHover } from "../components";
import { attachDevInspector } from "../dev/devInspector";
interface DropdownItem {
  label: string;
  href: string;
}

function safeParseConfig(hostEl: HTMLElement) {
  const configJson = hostEl.getAttribute("data-config");
  if (!configJson) return {};
  try {
    return JSON.parse(configJson);
  } catch {
    return {};
  }
}

// 🎨 Dev override utility (فقط DEV)
async function applyDevOverrides(componentId: string, hostEl: HTMLElement) {
  if (typeof __DEV__ === "undefined" || !__DEV__) return;

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
    // ignore
  }
}

class CTIFooterHoverElement extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null;
  private container: HTMLDivElement | null = null;

  static get observedAttributes() {
    return ["data-config"];
  }

  connectedCallback() {
    this.container = document.createElement("div");
    this.appendChild(this.container);

    this.root = createRoot(this.container);

    // dev inspector (فقط DEV)
    attachDevInspector(this, "cti-footer-hover");

    // اگر Inspector JSON را Apply کند
    this.addEventListener("cti:dev:config-changed", () => {
      this.render();
    });

    this.render();
  }

  attributeChangedCallback(name: string) {
    if (name === "data-config") {
      this.render();
    }
  }

  private async render() {
    if (!this.root) return;

    const config: any = safeParseConfig(this);
    const dropdownItems: DropdownItem[] = config.dropdownItems || [];

    this.root.render(
      <CTIFooterHover
        hoverLabel={config.hoverLabel || "Menu"}
        buttonText={config.buttonText || "Contact"}
        modalTitle={config.modalTitle || "Title"}
        modalBody={config.modalBody || "Content"}
        dropdownItems={dropdownItems}
      />
    );

    // dev overrides after render
    await applyDevOverrides("cti-footer-hover", this);
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
    this.container = null;
  }
}

customElements.define("cti-footer-hover", CTIFooterHoverElement);
