var C=Object.defineProperty;var E=(e,a,u)=>a in e?C(e,a,{enumerable:!0,configurable:!0,writable:!0,value:u}):e[a]=u;var g=(e,a,u)=>E(e,typeof a!="symbol"?a+"":a,u);(function(e,a){"use strict";const u=({hoverLabel:n="Menu",buttonText:r="Contact",modalTitle:o="Title",modalBody:t="Content",dropdownItems:s=[]})=>{var b,x;const[l,d]=e.useState(!1),c=(x=(b=window==null?void 0:window.CTI)==null?void 0:b.components)==null?void 0:x.Button_raw,p=e.useCallback(()=>{d(!0)},[]),f=e.useCallback(()=>{d(!1)},[]);return e.createElement("div",{style:y.host},e.createElement("style",null,`
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
      `),e.createElement("div",{className:"wrap"},e.createElement("div",{className:"row"},e.createElement("div",{className:"brand"},"CTI Footer"),e.createElement("div",{className:"hoverArea",onMouseEnter:p,onMouseLeave:f},e.createElement("button",{className:"btn"},n),e.createElement("div",{className:`dropdown ${l?"open":""}`},s.length?s.map((i,k)=>e.createElement("a",{key:k,className:"item",href:i.href||"#"},i.label||"Item")):e.createElement("div",{className:"item empty"},"No items")))),c?e.createElement(c,null):null))},y={host:{display:"block",fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"}};function h(n,r){var f,b,x;const o=`cti-dev-panel-${r}`;if(n.querySelector(`#${o}`))return;const t=document.createElement("div");t.id=o,t.style.position="fixed",t.style.right="12px",t.style.bottom="12px",t.style.zIndex="2147483647",t.style.fontFamily="ui-sans-serif, system-ui, -apple-system",t.style.width="340px",t.style.maxWidth="calc(100vw - 24px)",t.innerHTML=`
    <div style="
      background: rgba(15, 15, 15, 0.92);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 12px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.35);
      overflow: hidden;
    ">
      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.12);
      ">
        <div style="display:flex; gap:8px; align-items:center;">
          <span style="
            display:inline-flex; align-items:center; justify-content:center;
            width:28px; height:28px; border-radius:10px;
            background: rgba(255,255,255,0.12);
          ">⚙️</span>
          <div>
            <div style="font-size: 13px; font-weight: 700;">Dev Inspector</div>
            <div style="font-size: 11px; opacity: .75;">${r}</div>
          </div>
        </div>
        <button data-cti-close style="
          all:unset; cursor:pointer;
          padding: 6px 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.10);
          font-size: 12px;
        ">Hide</button>
      </div>

      <div style="padding: 10px 12px;">
        <div style="font-size: 12px; margin-bottom: 6px; opacity:.85;">data-config (JSON)</div>
        <textarea data-cti-json style="
          width:100%;
          height:140px;
          resize: vertical;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
          color: #fff;
          padding: 8px;
          outline: none;
          font-size: 12px;
          line-height: 1.4;
        "></textarea>

        <div style="display:flex; gap:8px; margin-top: 10px;">
          <button data-cti-apply style="
            all:unset; cursor:pointer;
            padding: 8px 10px;
            border-radius: 10px;
            background: rgba(0, 180, 255, 0.22);
            border: 1px solid rgba(0, 180, 255, 0.35);
            font-size: 12px;
            font-weight: 700;
            text-align:center;
            flex:1;
          ">Apply</button>

          <button data-cti-refresh style="
            all:unset; cursor:pointer;
            padding: 8px 10px;
            border-radius: 10px;
            background: rgba(255,255,255,0.10);
            border: 1px solid rgba(255,255,255,0.14);
            font-size: 12px;
            text-align:center;
            flex:1;
          ">Reload</button>
        </div>

        <div data-cti-error style="margin-top: 10px; font-size: 12px; color: #ffb4b4; display:none;"></div>
      </div>
    </div>
  `;const s=t.querySelector("textarea[data-cti-json]"),l=()=>n.getAttribute("data-config")||"{}";s.value=l();const d=t.querySelector("[data-cti-error]"),c=i=>{d.style.display="block",d.textContent=i},p=()=>{d.style.display="none",d.textContent=""};(f=t.querySelector("[data-cti-close]"))==null||f.addEventListener("click",()=>{t.remove()}),(b=t.querySelector("[data-cti-refresh]"))==null||b.addEventListener("click",()=>{p(),s.value=l()}),(x=t.querySelector("[data-cti-apply]"))==null||x.addEventListener("click",()=>{p();try{const i=JSON.parse(s.value||"{}");n.setAttribute("data-config",JSON.stringify(i)),n.dispatchEvent(new CustomEvent("cti:dev:config-changed",{bubbles:!1}))}catch(i){c((i==null?void 0:i.message)||"Invalid JSON")}}),document.body.appendChild(t)}function m(n){const r=n.getAttribute("data-config");if(!r)return{};try{return JSON.parse(r)}catch{return{}}}async function v(n,r){const t=`${globalThis.__CTI_CDN_URL__||"http://localhost:4000"}/overrides/components/${n}.json`;try{const s=await fetch(t,{cache:"no-store"});if(!s.ok)return;const l=await s.json(),d=(l==null?void 0:l.cssVars)||{};for(const[c,p]of Object.entries(d))c.startsWith("--")&&(p===""||p==null?r.style.removeProperty(c):r.style.setProperty(c,String(p)))}catch{}}class w extends HTMLElement{constructor(){super(...arguments);g(this,"root",null);g(this,"container",null)}static get observedAttributes(){return["data-config"]}connectedCallback(){this.container=document.createElement("div"),this.appendChild(this.container),this.root=a.createRoot(this.container),h(this,"cti-footer-hover"),this.addEventListener("cti:dev:config-changed",()=>{this.render()}),this.render()}attributeChangedCallback(o){o==="data-config"&&this.render()}async render(){if(!this.root)return;const o=m(this),t=o.dropdownItems||[];this.root.render(e.createElement(u,{hoverLabel:o.hoverLabel||"Menu",buttonText:o.buttonText||"Contact",modalTitle:o.modalTitle||"Title",modalBody:o.modalBody||"Content",dropdownItems:t})),await v("cti-footer-hover",this)}disconnectedCallback(){var o;(o=this.root)==null||o.unmount(),this.root=null,this.container=null}}customElements.define("cti-footer-hover",w)})(React,ReactDOMClient);
