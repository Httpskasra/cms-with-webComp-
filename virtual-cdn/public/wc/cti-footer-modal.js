var v=Object.defineProperty;var w=(e,t,n)=>t in e?v(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var b=(e,t,n)=>w(e,typeof t!="symbol"?t+"":t,n);(function(e,t){"use strict";const n=({buttonText:d="Open",modalTitle:c="Title",modalBody:o="Content"})=>{var p,m;const[a,l]=e.useState(!1),r=(m=(p=window==null?void 0:window.CTI)==null?void 0:p.components)==null?void 0:m.TitleComp,f=e.useCallback(()=>{l(i=>!i)},[]),s=e.useCallback(()=>{l(!1)},[]),x=e.useCallback(()=>{s()},[s]),u=i=>{const h={"&":"&amp;","<":"&lt;",">":"&gt;"};return String(i??"").replace(/[&<>]/g,y=>h[y])};return e.createElement("div",{className:"cti-footer-modal"},e.createElement("style",null,`
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
        .overlay.open { display: block; }

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
        .modal.open { display: block; }

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
      `),e.createElement("div",{className:"wrap"},e.createElement("div",{className:"row"},r?e.createElement(r,null):null,e.createElement("div",{className:"brand"},"CTI Footer"),e.createElement("button",{className:"btn",onClick:f},d))),e.createElement("div",{className:`overlay ${a?"open":""}`,onClick:x}),e.createElement("div",{className:`modal ${a?"open":""}`},e.createElement("div",{className:"modalTop"},e.createElement("div",{className:"title"},c),e.createElement("button",{className:"close",onClick:s},"Close")),e.createElement("div",{className:"body",dangerouslySetInnerHTML:{__html:u(o)}})))};class g extends HTMLElement{constructor(){super(...arguments);b(this,"root",null)}connectedCallback(){const o=document.createElement("div");this.appendChild(o);const a=this.getAttribute("data-config"),l=a?JSON.parse(a):{},r=t.createRoot(o);this.root=r,r.render(e.createElement(n,{buttonText:l.buttonText||"Open",modalTitle:l.modalTitle||"Title",modalBody:l.modalBody||"Content"}))}disconnectedCallback(){var o;(o=this.root)==null||o.unmount()}}customElements.define("cti-footer-modal",g)})(React,ReactDOMClient);
