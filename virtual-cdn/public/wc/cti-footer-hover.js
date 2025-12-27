class CTIFooterHover extends HTMLElement {
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
    const dropdown = this.shadowRoot?.querySelector(".dropdown");

    if (dropdown) {
      dropdown.toggleAttribute("data-open", this._open);
    }
  }

  render() {
    const cfg = this._config || {};
    const hoverLabel = cfg.hoverLabel || "Menu";
    const items = Array.isArray(cfg.dropdownItems) ? cfg.dropdownItems : [];

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

        .hoverArea {
          position: relative;
        }

        .dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          min-width: 220px;
          padding: 8px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.12);
          background: #fff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          display: none;
          z-index: 50;
        }

        .dropdown[data-open] { display: block; }

        .item {
          display: block;
          padding: 10px 10px;
          border-radius: 10px;
          text-decoration: none;
          color: #111827;
          font-weight: 600;
          font-size: 14px;
        }
        .item:hover { background: rgba(0,0,0,0.06); }

        @media (max-width: 520px) {
          .row { flex-direction: column; align-items: stretch; }
          .btn { width: 100%; text-align: center; }
          .dropdown { left: 0; right: 0; min-width: unset; }
        }
      </style>

      <div class="wrap">
        <div class="row">
          <div class="brand">CTI Footer</div>
          <div class="hoverArea" id="hoverArea">
            <button class="btn" id="hoverBtn">${hoverLabel}</button>
            <div class="dropdown" id="dropdown">
              ${
                items.length
                  ? items
                      .map(
                        (x) =>
                          `<a class="item" href="${x.href || "#"}">${
                            x.label || "Item"
                          }</a>`
                      )
                      .join("")
                  : `<div class="item" style="opacity:.6; cursor:default;">No items</div>`
              }
            </div>
          </div>
        </div>
      </div>
    `;

    const hoverArea = this.shadowRoot.querySelector("#hoverArea");
    const dropdown = this.shadowRoot.querySelector("#dropdown");

    if (hoverArea && dropdown) {
      hoverArea.addEventListener("mouseenter", () => {
        this._open = true;
        this._syncOpenState();
      });
      hoverArea.addEventListener("mouseleave", () => {
        this._open = false;
        this._syncOpenState();
      });
    }

    this._syncOpenState();
  }
}

customElements.define("cti-footer-hover", CTIFooterHover);
