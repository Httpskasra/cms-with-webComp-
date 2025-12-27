var i = Object.defineProperty;
var a = (e, t, o) =>
  t in e
    ? i(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o })
    : (e[t] = o);
var s = (e, t, o) => a(e, typeof t != "symbol" ? t + "" : t, o);
(function (e, t) {
  "use strict";
  const o = ({ children: r }) =>
    e.createElement(
      "footer",
      {
        style: {
          width: "100%",
          background: "var(--footer-bg, #fff)",
          color: "var(--footer-text, #111827)",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        },
      },
      r
    );
  class c extends HTMLElement {
    constructor() {
      super(...arguments);
      s(this, "root", null);
    }
    connectedCallback() {
      const n = document.createElement("div");
      this.appendChild(n);
      const l = t.createRoot(n);
      (this.root = l),
        l.render(
          e.createElement(
            o,
            null,
            this.innerHTML && e.createElement(e.Fragment, null, this.innerHTML)
          )
        );
    }
    disconnectedCallback() {
      var n;
      (n = this.root) == null || n.unmount();
    }
  }
  customElements.define("cti-footer", c);
})(React, ReactDOMClient);
