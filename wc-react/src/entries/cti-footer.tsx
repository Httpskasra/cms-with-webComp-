import React from "react";
import { createRoot } from "react-dom/client";
import { CTIFooter } from "../components";

class CTIFooterElement extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null;

  connectedCallback() {
    const container = document.createElement("div");
    this.appendChild(container);

    const root = createRoot(container);
    this.root = root;

    root.render(
      <CTIFooter>{this.innerHTML && <>{this.innerHTML}</>}</CTIFooter>
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
  }
}

customElements.define("cti-footer", CTIFooterElement);
