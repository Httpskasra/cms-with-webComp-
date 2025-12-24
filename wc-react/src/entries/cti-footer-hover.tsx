import React from "react";
import { createRoot } from "react-dom/client";
import { CTIFooterHover } from "../components";

interface DropdownItem {
  label: string;
  href: string;
}

class CTIFooterHoverElement extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null;

  connectedCallback() {
    const container = document.createElement("div");
    this.appendChild(container);

    // const hoverLabel = this.getAttribute("data-hover-label") || "Menu";
    // const itemsJson = this.getAttribute("data-items");

    // const dropdownItems: DropdownItem[] = itemsJson
    //   ? JSON.parse(itemsJson)
    //   : [];
    const configJson = this.getAttribute("data-config");
    const config = configJson ? JSON.parse(configJson) : {};
    const dropdownItems: DropdownItem[] = config.dropdownItems || [];

    const root = createRoot(container);
    this.root = root;

    root.render(
      <CTIFooterHover
        hoverLabel={config.hoverLabel || "Menu"}
        dropdownItems={dropdownItems || config.dropdownItems}
      />
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
  }
}

customElements.define("cti-footer-hover", CTIFooterHoverElement);
