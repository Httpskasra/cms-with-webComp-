class CTIFooterModal extends HTMLElement {
  constructor() {
    super();
    this._config = null;
    this._open = false;

    this.attachShadow({ mode: "open" });
    this._onDocClick = this._onDocClick.bind(this);
  }

  set config(value) {
    this._config = value;
    this.render();
  }

  get config() {
    return this._config;
  }

  connectedCallback() {
    if (this.hasOwnProperty("config")) {
      const value = this.config;
      delete this.config;
      this.config = value;
    }

    const raw = this.getAttribute("data-config");
    if (raw && !this._config) {
      try {
        this._config = JSON.parse(raw);
      } catch (e) {}
    }

    this.render();
    document.addEventListener("click", this._onDocClick);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this._onDocClick);
  }

  _onDocClick(e) {
    if (!this.shadowRoot) return;
    const path = e.composedPath?.() || [];
    if (!path.includes(this)) {
      this._open = false;
      this._syncOpenState();
    }
  }

  _toggleOpen() {
    this._open = !this._open;
    this._syncOpenState();
  }

  _close() {
    this._open = false;
    this._syncOpenState();
  }

  _syncOpenState() {
    const modal = this.shadowRoot?.querySelector(".modal");
    const overlay = this.shadowRoot?.querySelector(".overlay");

    if (modal && overlay) {
      overlay.toggleAttribute("data-open", this._open);
      modal.toggleAttribute("data-open", this._open);
    }
  }

  render() {
    const cfg = this._config || {};
    const buttonText = cfg.buttonText || "Open";
    const modalTitle = cfg.modalTitle || "Title";
    const modalBody = cfg.modalBody || "Content";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        .wrap {
          position: relative;
          width: 100%;
          padding: 14px 16px;
          border-top: 1px solid rgba(157, 14, 14, 0.08);
          background: var(--footer-bg, #fff);
          color: var(--footer-text, #111827);
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .brand {
          font-weight: 600;
          letter-spacing: 0.2px;
          opacity: 0.9;
        }

        .btn {
          all: unset;
          cursor: pointer;
          user-select: none;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(230, 222, 222, 0.14);
          background: var(--footer-btn-bg, #111827);
          color: var(--footer-btn-text, #ffffff);
          font-weight: 600;
          line-height: 1;
        }
        .btn:hover { opacity: 0.92; }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.48);
          display: none;
          z-index: 60;
        }
        .overlay[data-open] { display: block; }

        .modal {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(520px, calc(100% - 24px));
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.12);
          box-shadow: 0 20px 60px rgba(0,0,0,0.22);
          padding: 16px;
          display: none;
          z-index: 61;
        }
        .modal[data-open] { display: block; }

        .modalTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .title {
          font-weight: 800;
          font-size: 16px;
        }

        .close {
          all: unset;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.12);
          font-weight: 700;
        }
        .close:hover { background: rgba(0,0,0,0.06); }

        .body {
          padding-top: 12px;
          line-height: 1.6;
          font-size: 14px;
          color: rgba(17,24,39,0.92);
          white-space: pre-wrap;
        }

        @media (max-width: 520px) {
          .row { flex-direction: column; align-items: stretch; }
          .btn { width: 100%; text-align: center; }
        }
      </style>

      <div class="wrap">
        <div class="row">
          <div class="brand">CTI Footer</div>
          <button class="btn" id="openBtn">${buttonText}</button>
        </div>
      </div>

      <div class="overlay" id="overlay"></div>
      <div class="modal" id="modal">
        <div class="modalTop">
          <div class="title">${modalTitle}</div>
          <button class="close" id="closeBtn">Close</button>
        </div>
        <div class="body">${this._escapeHtml(modalBody)}</div>
      </div>
    `;

    const openBtn = this.shadowRoot.querySelector("#openBtn");
    const overlay = this.shadowRoot.querySelector("#overlay");
    const closeBtn = this.shadowRoot.querySelector("#closeBtn");

    if (openBtn) openBtn.addEventListener("click", () => this._toggleOpen());
    if (overlay) overlay.addEventListener("click", () => this._close());
    if (closeBtn) closeBtn.addEventListener("click", () => this._close());

    this._syncOpenState();
  }

  _escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
}

customElements.define("cti-footer-modal", CTIFooterModal);
