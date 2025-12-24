var h=Object.defineProperty;var x=(e,t,n)=>t in e?h(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var u=(e,t,n)=>x(e,typeof t!="symbol"?t+"":t,n);(function(e,t){"use strict";const n=({hoverLabel:d="Menu",dropdownItems:i=[]})=>{var c,p;const[o,s]=e.useState(!1),r=(p=(c=window==null?void 0:window.CTI)==null?void 0:c.components)==null?void 0:p.Button_raw,l=e.useCallback(()=>{s(!0)},[]),a=e.useCallback(()=>{s(!1)},[]);return e.createElement("div",{style:b.host},e.createElement("style",null,`
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

        .dropdown.open { display: block; 
          top:-5px;
          transition:0.5s;}

        .item {
          display: block;
          padding: 10px 10px;
          border-radius: 10px;
          text-decoration: none;
          color: #111827;
          font-weight: 600;
          font-size: 14px;
          transition: background 0.2s;
        }
        .item:hover { background: rgba(0,0,0,0.06); }

        .empty {
          opacity: 0.6;
          cursor: default;
        }

        @media (max-width: 520px) {
          .row { flex-direction: column; align-items: stretch; }
          .btn { width: 100%; text-align: center; }
          .dropdown { left: 0; right: 0; min-width: unset; }
        }
      `),e.createElement("div",{className:"wrap"},e.createElement("div",{className:"row"},e.createElement("div",{className:"brand"},"CTI Footer"),e.createElement("div",{className:"hoverArea",onMouseEnter:l,onMouseLeave:a},e.createElement("button",{className:"btn"},d),e.createElement("div",{className:`dropdown ${o?"open":""}`},i.length?i.map((m,g)=>e.createElement("a",{key:g,className:"item",href:m.href||"#"},m.label||"Item")):e.createElement("div",{className:"item empty"},"No items")))),r?e.createElement(r,null):null))},b={host:{display:"block",fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"}};class f extends HTMLElement{constructor(){super(...arguments);u(this,"root",null)}connectedCallback(){const o=document.createElement("div");this.appendChild(o);const s=this.getAttribute("data-config"),r=s?JSON.parse(s):{},l=r.dropdownItems||[],a=t.createRoot(o);this.root=a,a.render(e.createElement(n,{hoverLabel:r.hoverLabel||"Menu",dropdownItems:l||r.dropdownItems}))}disconnectedCallback(){var o;(o=this.root)==null||o.unmount()}}customElements.define("cti-footer-hover",f)})(React,ReactDOMClient);
