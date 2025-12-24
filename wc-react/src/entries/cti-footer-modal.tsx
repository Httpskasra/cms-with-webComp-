import React from "react";
import { createRoot } from "react-dom/client";
import { CTIFooterModal } from "../components";

class CTIFooterModalElement extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null;

  connectedCallback() {
    const container = document.createElement("div");
    this.appendChild(container);

    // const buttonText = this.getAttribute("data-button-text") || "Open";
    // const modalTitle = this.getAttribute("data-modal-title") || "Title";
    // const modalBody = this.getAttribute("data-modal-body") || "Content";
    const configJson = this.getAttribute("data-config");
    const config = configJson ? JSON.parse(configJson) : {};

    const root = createRoot(container);
    this.root = root;

    root.render(
      <CTIFooterModal
        buttonText={config.buttonText || "Open"}
        modalTitle={config.modalTitle || "Title"}
        modalBody={config.modalBody || "Content"}
      />
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
  }
}

customElements.define("cti-footer-modal", CTIFooterModalElement);
