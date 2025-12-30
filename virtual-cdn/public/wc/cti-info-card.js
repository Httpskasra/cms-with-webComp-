var k=Object.defineProperty;var D=(e,s,p)=>s in e?k(e,s,{enumerable:!0,configurable:!0,writable:!0,value:p}):e[s]=p;var h=(e,s,p)=>D(e,typeof s!="symbol"?s+"":s,p);(function(e,s){"use strict";const p=({title:t="Info Card",description:r="This is a reusable info card web component.",ctaText:n="Learn more",ctaHref:c="#",styles:i={}})=>e.createElement("div",{className:"cti-info-card"},e.createElement("div",{className:"wrap",style:i.card},e.createElement("h3",{className:"title",style:i.title},t),e.createElement("p",{className:"desc",style:i.description},r),e.createElement("a",{className:"cta",href:c,target:"_blank",rel:"noreferrer",style:i.cta},n,e.createElement("span",{"aria-hidden":"true"},"→"))));function x(t){const r=t.getAttribute("data-inspector");if(r==="1"||r==="true")return!0;const n=globalThis;return!!(n&&n.__CTI_WC_DEV__===!0)}function C(t){if(!t)return{};try{const r=JSON.parse(t);return r&&typeof r=="object"?r:{}}catch{return{}}}function w(t){try{return JSON.stringify(t)}catch{return"{}"}}function I({value:t,onChange:r}){var f,E,v,y;const n=e.useRef(null),[c,i]=e.useState({x:10,y:10}),[a,m]=e.useState(!1),u=e.useRef({x:0,y:0}),g=o=>{o.stopPropagation(),m(!0);const d=n.current.getBoundingClientRect();u.current={x:o.clientX-d.left,y:o.clientY-d.top},o.preventDefault()},b=o=>{a&&i({x:o.clientX-u.current.x,y:o.clientY-u.current.y})},l=()=>m(!1);return e.useEffect(()=>(window.addEventListener("mousemove",b),window.addEventListener("mouseup",l),()=>{window.removeEventListener("mousemove",b),window.removeEventListener("mouseup",l)}),[a]),e.createElement("div",{ref:n,className:"cti-dev-inspector",style:{transform:`translate(${c.x}px, ${c.y}px)`}},e.createElement("style",null,`
        .cti-dev-inspector {
          position: absolute;
          width: min(360px, calc(100% - 20px));
          background: rgba(17,24,39,0.92);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 12px;
          z-index: 9999;
          backdrop-filter: blur(8px);
          user-select: none;
        }
        .cti-dev-inspector .drag-btn {
          all: unset;
          cursor: grab;
          padding: 4px 8px;
          background: rgba(255,255,255,0.12);
          border-radius: 6px;
          font-size: 12px;
          margin-left: 8px;
        }
        .cti-dev-inspector label { font-size: 11px; opacity: 0.8; margin-bottom: 4px; display: block; }
        .cti-dev-inspector input, .cti-dev-inspector textarea {
          width: 100%; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.08); color: #fff; padding: 9px 10px; outline: none; font-size: 12px;
        }
        .cti-dev-inspector textarea { min-height: 70px; resize: vertical; }
        .cti-dev-inspector .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .cti-dev-inspector .actions { display: flex; gap: 8px; margin-top: 10px; }
        .cti-dev-inspector button { all: unset; cursor: pointer; border-radius: 10px; padding: 9px 10px; font-size: 12px; font-weight: 800; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.10); flex: 1; text-align: center; }
        .cti-dev-inspector button:hover { opacity: 0.92; }
      `),e.createElement("div",{className:"head",style:{display:"flex",alignItems:"center",justifyContent:"space-between"}},e.createElement("div",null,e.createElement("div",{className:"ttl"},"DEV Inspector: cti-info-card"),e.createElement("div",{className:"hint"},"Use Drag button to move")),e.createElement("button",{className:"drag-btn",onMouseDown:g},"Drag")),e.createElement("div",{className:"grid"},e.createElement("div",null,e.createElement("label",null,"Title"),e.createElement("input",{value:t.title??"",onChange:o=>r({...t,title:o.target.value}),placeholder:"Card title..."})),e.createElement("div",null,e.createElement("label",null,"Description"),e.createElement("textarea",{value:t.description??"",onChange:o=>r({...t,description:o.target.value}),placeholder:"Card description..."})),e.createElement("div",{className:"row2"},e.createElement("div",null,e.createElement("label",null,"CTA Text"),e.createElement("input",{value:t.ctaText??"",onChange:o=>r({...t,ctaText:o.target.value}),placeholder:"Learn more"})),e.createElement("div",null,e.createElement("label",null,"CTA Href"),e.createElement("input",{value:t.ctaHref??"",onChange:o=>r({...t,ctaHref:o.target.value}),placeholder:"https://..."}))),e.createElement("div",null,e.createElement("label",null,"Card Background"),e.createElement("input",{type:"color",value:((E=(f=t.styles)==null?void 0:f.card)==null?void 0:E.backgroundColor)||"#ffffff",onChange:o=>{var d;return r({...t,styles:{...t.styles,card:{...(d=t.styles)==null?void 0:d.card,backgroundColor:o.target.value}}})}})),e.createElement("div",null,e.createElement("label",null,"Title Color"),e.createElement("input",{type:"color",value:((y=(v=t.styles)==null?void 0:v.title)==null?void 0:y.color)||"#111827",onChange:o=>{var d;return r({...t,styles:{...t.styles,title:{...(d=t.styles)==null?void 0:d.title,color:o.target.value}}})}}))),e.createElement("div",{className:"actions"},e.createElement("button",{type:"button",onClick:()=>r({title:"Info Card",description:"This is a reusable info card web component.",ctaText:"Learn more",ctaHref:"#",styles:{}})},"Reset")))}function T({hostEl:t,initialConfig:r}){const[n,c]=e.useState(r),i=e.useMemo(()=>({title:n.title??"Info Card",description:n.description??"This is a reusable info card web component.",ctaText:n.ctaText??"Learn more",ctaHref:n.ctaHref??"#"}),[n]),[a,m]=e.useState(()=>x(t));e.useEffect(()=>{if(a)return;let l=0;const f=window.setInterval(()=>{l+=1,x(t)?(m(!0),window.clearInterval(f)):l>=20&&window.clearInterval(f)},250);return()=>window.clearInterval(f)},[a,t]);const[u,g]=e.useState(!1);e.useEffect(()=>{a&&g(!0)},[a]);const b=l=>{c(l),a&&(t.setAttribute("data-config",w(l)),t.dispatchEvent(new CustomEvent("cti:config-change",{detail:l,bubbles:!0})))};return e.createElement("div",{className:"cti-info-card-host"},e.createElement("style",null,`
        .cti-info-card-host { position: relative; display: block; }
        .cti-toggle-btn {
          all: unset;
          cursor: pointer;
          user-select: none;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(0,0,0,0.2);
          background: rgba(255,255,255,0.1);
          position: absolute;
          right: 10px;
          top: 10px;
          z-index: 9999;
        }
      `),e.createElement(p,{...i,styles:n.styles}),a&&e.createElement(e.Fragment,null,e.createElement("button",{className:"cti-toggle-btn",onClick:()=>g(l=>!l)},u?"Close Inspector":"Open Inspector"),u&&e.createElement(I,{value:n,onChange:b})))}class N extends HTMLElement{constructor(){super(...arguments);h(this,"root",null)}connectedCallback(){const n=document.createElement("div");this.appendChild(n);const c=C(this.getAttribute("data-config")),i=s.createRoot(n);this.root=i,i.render(e.createElement(T,{hostEl:this,initialConfig:c}))}disconnectedCallback(){var n;(n=this.root)==null||n.unmount()}}customElements.define("cti-info-card",N)})(React,ReactDOMClient);
