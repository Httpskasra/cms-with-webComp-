var w=Object.defineProperty;var C=(e,t,r)=>t in e?w(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var g=(e,t,r)=>C(e,typeof t!="symbol"?t+"":t,r);(function(e,t){"use strict";const r=({buttonText:d="Open",modalTitle:i="Title",modalBody:s="Content"})=>{var b,f;const[a,o]=e.useState(!1),n=(f=(b=window==null?void 0:window.CTI)==null?void 0:b.components)==null?void 0:f.TitleComp,p=e.useCallback(()=>{o(m=>!m)},[]),l=e.useCallback(()=>{o(!1)},[]),c=e.useCallback(()=>{l()},[l]),y=m=>{const h={"&":"&amp;","<":"&lt;",">":"&gt;"};return String(m??"").replace(/[&<>]/g,v=>h[v])};return e.createElement("div",{className:"cti-footer-modal"},e.createElement("style",null,`
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
      `),e.createElement("div",{className:"wrap"},e.createElement("div",{className:"row"},n?e.createElement(n,null):null,e.createElement("div",{className:"brand"},"CTI Footer"),e.createElement("button",{className:"btn",onClick:p},d))),e.createElement("div",{className:`overlay ${a?"open":""}`,onClick:c}),e.createElement("div",{className:`modal ${a?"open":""}`},e.createElement("div",{className:"modalTop"},e.createElement("div",{className:"title"},i),e.createElement("button",{className:"close",onClick:l},"Close")),e.createElement("div",{className:"body",dangerouslySetInnerHTML:{__html:y(s)}})))};async function u(d,i){if(typeof process<"u")return;const a=`${globalThis.__CTI_CDN_URL__||"http://localhost:4000"}/overrides/components/${d}.json`;try{const o=await fetch(a,{cache:"no-store"});if(!o.ok)return;const n=await o.json(),p=(n==null?void 0:n.cssVars)||{};for(const[l,c]of Object.entries(p))l.startsWith("--")&&(c===""||c==null?i.style.removeProperty(l):i.style.setProperty(l,String(c)))}catch{}}class x extends HTMLElement{constructor(){super(...arguments);g(this,"root",null)}async connectedCallback(){const s=document.createElement("div");this.appendChild(s);const a=this.getAttribute("data-config"),o=a?JSON.parse(a):{},n=t.createRoot(s);this.root=n,n.render(e.createElement(r,{buttonText:o.buttonText||"Open",modalTitle:o.modalTitle||"Title",modalBody:o.modalBody||"Content"})),await u("cti-footer-modal",this)}disconnectedCallback(){var s;(s=this.root)==null||s.unmount()}}customElements.define("cti-footer-modal",x)})(React,ReactDOMClient);
