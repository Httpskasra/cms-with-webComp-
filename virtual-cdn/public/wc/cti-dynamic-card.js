var F=Object.defineProperty;var V=(e,u,y)=>u in e?F(e,u,{enumerable:!0,configurable:!0,writable:!0,value:y}):e[u]=y;var L=(e,u,y)=>V(e,typeof u!="symbol"?u+"":u,y);(function(e,u){"use strict";const y=({title:t="Dynamic Card",subtitle:i="",description:r="This is a fully dynamic card component with customizable content and styles.",primaryButtonText:l="Primary Action",primaryButtonHref:c="#",secondaryButtonText:d="Secondary Action",secondaryButtonHref:s="#",imageUrl:g="",imageAlt:x="Card image",badge:f="",styles:a={}})=>e.createElement("div",{className:"cti-dynamic-card",style:a.container},e.createElement("style",null,`
        .cti-dynamic-card {
          display: block;
          width: 100%;
        }
        .cti-dynamic-card .card-wrap {
          position: relative;
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .cti-dynamic-card .badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #3b82f6;
          color: #ffffff;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          z-index: 1;
        }
        .cti-dynamic-card .image-container {
          width: 100%;
          margin-bottom: 16px;
          border-radius: 8px;
          overflow: hidden;
        }
        .cti-dynamic-card .card-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }
        .cti-dynamic-card .content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cti-dynamic-card .title {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.2;
          color: #111827;
        }
        .cti-dynamic-card .subtitle {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.3;
          color: #6b7280;
        }
        .cti-dynamic-card .description {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #4b5563;
        }
        .cti-dynamic-card .buttons {
          display: flex;
          gap: 12px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .cti-dynamic-card .btn {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .cti-dynamic-card .btn-primary {
          background: #3b82f6;
          color: #ffffff;
        }
        .cti-dynamic-card .btn-primary:hover {
          background: #2563eb;
          opacity: 0.9;
        }
        .cti-dynamic-card .btn-secondary {
          background: #e5e7eb;
          color: #111827;
        }
        .cti-dynamic-card .btn-secondary:hover {
          background: #d1d5db;
          opacity: 0.9;
        }
      `),e.createElement("div",{className:"card-wrap",style:a.card},f&&e.createElement("div",{className:"badge",style:a.badge},f),g&&e.createElement("div",{className:"image-container"},e.createElement("img",{src:g,alt:x,className:"card-image",style:a.image})),e.createElement("div",{className:"content"},t&&e.createElement("h2",{className:"title",style:a.title},t),i&&e.createElement("h3",{className:"subtitle",style:a.subtitle},i),r&&e.createElement("p",{className:"description",style:a.description},r),(l||d)&&e.createElement("div",{className:"buttons",style:a.buttonsContainer},l&&e.createElement("a",{href:c,className:"btn btn-primary",style:a.primaryButton,target:"_blank",rel:"noreferrer"},l),d&&e.createElement("a",{href:s,className:"btn btn-secondary",style:a.secondaryButton,target:"_blank",rel:"noreferrer"},d)))));function B(t){const i=t.getAttribute("data-inspector");if(i==="1"||i==="true")return!0;const r=globalThis;return!!(r&&r.__CTI_WC_DEV__===!0)}function C(t){if(!t)return{};try{const i=JSON.parse(t);return i&&typeof i=="object"?i:{}}catch{return{}}}function _(t){try{return JSON.stringify(t)}catch{return"{}"}}function U({value:t,onChange:i}){var m,v,p,b,E,h,k,S,I,T,z,A,D,H,O,P;const r=e.useRef(null),[l,c]=e.useState({x:10,y:10}),[d,s]=e.useState(!1),g=e.useRef({x:0,y:0}),x=n=>{n.stopPropagation(),s(!0);const w=r.current.getBoundingClientRect();g.current={x:n.clientX-w.left,y:n.clientY-w.top},n.preventDefault()},f=n=>{d&&c({x:n.clientX-g.current.x,y:n.clientY-g.current.y})},a=()=>s(!1);e.useEffect(()=>(window.addEventListener("mousemove",f),window.addEventListener("mouseup",a),()=>{window.removeEventListener("mousemove",f),window.removeEventListener("mouseup",a)}),[d]);const o=(n,w,j)=>{var M;i({...t,styles:{...t.styles,[n]:{...(M=t.styles)==null?void 0:M[n],[w]:j}}})};return e.createElement("div",{ref:r,className:"cti-dev-inspector",style:{transform:`translate(${l.x}px, ${l.y}px)`}},e.createElement("style",null,`
        .cti-dev-inspector {
          position: absolute;
          width: min(420px, calc(100% - 20px));
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          background: rgba(17,24,39,0.95);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px;
          padding: 16px;
          z-index: 9999;
          backdrop-filter: blur(8px);
          user-select: none;
        }
        .cti-dev-inspector .drag-btn {
          all: unset;
          cursor: grab;
          padding: 6px 10px;
          background: rgba(255,255,255,0.12);
          border-radius: 6px;
          font-size: 12px;
          margin-left: 8px;
        }
        .cti-dev-inspector label { 
          font-size: 11px; 
          opacity: 0.8; 
          margin-bottom: 4px; 
          display: block; 
          font-weight: 600;
        }
        .cti-dev-inspector input, 
        .cti-dev-inspector textarea {
          width: 100%; 
          border-radius: 8px; 
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.08); 
          color: #fff; 
          padding: 8px 10px; 
          outline: none; 
          font-size: 12px;
          box-sizing: border-box;
        }
        .cti-dev-inspector input:focus,
        .cti-dev-inspector textarea:focus {
          border-color: rgba(59, 130, 246, 0.5);
          background: rgba(255,255,255,0.12);
        }
        .cti-dev-inspector textarea { 
          min-height: 70px; 
          resize: vertical; 
        }
        .cti-dev-inspector .row2 { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 8px; 
        }
        .cti-dev-inspector .row3 { 
          display: grid; 
          grid-template-columns: 1fr 1fr 1fr; 
          gap: 8px; 
        }
        .cti-dev-inspector .actions { 
          display: flex; 
          gap: 8px; 
          margin-top: 12px; 
        }
        .cti-dev-inspector button { 
          all: unset; 
          cursor: pointer; 
          border-radius: 8px; 
          padding: 9px 12px; 
          font-size: 12px; 
          font-weight: 600; 
          border: 1px solid rgba(255,255,255,0.12); 
          background: rgba(255,255,255,0.10); 
          flex: 1; 
          text-align: center; 
          transition: all 0.2s;
        }
        .cti-dev-inspector button:hover { 
          opacity: 0.85; 
          background: rgba(255,255,255,0.15);
        }
        .cti-dev-inspector .section {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .cti-dev-inspector .section:last-child {
          border-bottom: none;
        }
        .cti-dev-inspector .section-title {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 12px;
          color: rgba(255,255,255,0.9);
        }
      `),e.createElement("div",{className:"head",style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}},e.createElement("div",null,e.createElement("div",{className:"ttl",style:{fontSize:"14px",fontWeight:700}},"DEV Inspector: cti-dynamic-card"),e.createElement("div",{className:"hint",style:{fontSize:"11px",opacity:.7}},"Use Drag button to move")),e.createElement("button",{className:"drag-btn",onMouseDown:x},"Drag")),e.createElement("div",{className:"grid"},e.createElement("div",{className:"section"},e.createElement("div",{className:"section-title"},"Content"),e.createElement("div",{style:{marginBottom:"12px"}},e.createElement("label",null,"Title"),e.createElement("input",{value:t.title??"",onChange:n=>i({...t,title:n.target.value}),placeholder:"Card title..."})),e.createElement("div",{style:{marginBottom:"12px"}},e.createElement("label",null,"Subtitle"),e.createElement("input",{value:t.subtitle??"",onChange:n=>i({...t,subtitle:n.target.value}),placeholder:"Card subtitle..."})),e.createElement("div",{style:{marginBottom:"12px"}},e.createElement("label",null,"Description"),e.createElement("textarea",{value:t.description??"",onChange:n=>i({...t,description:n.target.value}),placeholder:"Card description..."})),e.createElement("div",{className:"row2",style:{marginBottom:"12px"}},e.createElement("div",null,e.createElement("label",null,"Badge"),e.createElement("input",{value:t.badge??"",onChange:n=>i({...t,badge:n.target.value}),placeholder:"New"})),e.createElement("div",null,e.createElement("label",null,"Image URL"),e.createElement("input",{value:t.imageUrl??"",onChange:n=>i({...t,imageUrl:n.target.value}),placeholder:"https://..."}))),e.createElement("div",null,e.createElement("label",null,"Image Alt Text"),e.createElement("input",{value:t.imageAlt??"",onChange:n=>i({...t,imageAlt:n.target.value}),placeholder:"Image description"}))),e.createElement("div",{className:"section"},e.createElement("div",{className:"section-title"},"Buttons"),e.createElement("div",{className:"row2",style:{marginBottom:"12px"}},e.createElement("div",null,e.createElement("label",null,"Primary Button Text"),e.createElement("input",{value:t.primaryButtonText??"",onChange:n=>i({...t,primaryButtonText:n.target.value}),placeholder:"Primary Action"})),e.createElement("div",null,e.createElement("label",null,"Primary Button Href"),e.createElement("input",{value:t.primaryButtonHref??"",onChange:n=>i({...t,primaryButtonHref:n.target.value}),placeholder:"https://..."}))),e.createElement("div",{className:"row2"},e.createElement("div",null,e.createElement("label",null,"Secondary Button Text"),e.createElement("input",{value:t.secondaryButtonText??"",onChange:n=>i({...t,secondaryButtonText:n.target.value}),placeholder:"Secondary Action"})),e.createElement("div",null,e.createElement("label",null,"Secondary Button Href"),e.createElement("input",{value:t.secondaryButtonHref??"",onChange:n=>i({...t,secondaryButtonHref:n.target.value}),placeholder:"https://..."})))),e.createElement("div",{className:"section"},e.createElement("div",{className:"section-title"},"Styles"),e.createElement("div",{style:{marginBottom:"12px"}},e.createElement("label",null,"Card Background"),e.createElement("input",{type:"text",value:((v=(m=t.styles)==null?void 0:m.card)==null?void 0:v.backgroundColor)||"#ffffff",onChange:n=>o("card","backgroundColor",n.target.value)})),e.createElement("div",{className:"row2",style:{marginBottom:"12px"}},e.createElement("div",null,e.createElement("label",null,"Title Color"),e.createElement("input",{type:"text",value:((b=(p=t.styles)==null?void 0:p.title)==null?void 0:b.color)||"#111827",onChange:n=>o("title","color",n.target.value)})),e.createElement("div",null,e.createElement("label",null,"Subtitle Color"),e.createElement("input",{type:"text",value:((h=(E=t.styles)==null?void 0:E.subtitle)==null?void 0:h.color)||"#6b7280",onChange:n=>o("subtitle","color",n.target.value)}))),e.createElement("div",{style:{marginBottom:"12px"}},e.createElement("label",null,"Description Color"),e.createElement("input",{type:"text",value:((S=(k=t.styles)==null?void 0:k.description)==null?void 0:S.color)||"#4b5563",onChange:n=>o("description","color",n.target.value)})),e.createElement("div",{className:"row2",style:{marginBottom:"12px"}},e.createElement("div",null,e.createElement("label",null,"Primary Button Background"),e.createElement("input",{type:"text",value:((T=(I=t.styles)==null?void 0:I.primaryButton)==null?void 0:T.backgroundColor)||"#3b82f6",onChange:n=>o("primaryButton","backgroundColor",n.target.value)})),e.createElement("div",null,e.createElement("label",null,"Primary Button Text Color"),e.createElement("input",{type:"text",value:((A=(z=t.styles)==null?void 0:z.primaryButton)==null?void 0:A.color)||"#ffffff",onChange:n=>o("primaryButton","color",n.target.value)}))),e.createElement("div",{className:"row2"},e.createElement("div",null,e.createElement("label",null,"Secondary Button Background"),e.createElement("input",{type:"text",value:((H=(D=t.styles)==null?void 0:D.secondaryButton)==null?void 0:H.backgroundColor)||"#e5e7eb",onChange:n=>o("secondaryButton","backgroundColor",n.target.value)})),e.createElement("div",null,e.createElement("label",null,"Secondary Button Text Color"),e.createElement("input",{type:"text",value:((P=(O=t.styles)==null?void 0:O.secondaryButton)==null?void 0:P.color)||"#111827",onChange:n=>o("secondaryButton","color",n.target.value)}))))),e.createElement("div",{className:"actions"},e.createElement("button",{type:"button",onClick:()=>i({title:"Dynamic Card",subtitle:"Subtitle",description:"This is a fully dynamic card component.",primaryButtonText:"Primary Action",primaryButtonHref:"#",secondaryButtonText:"Secondary Action",secondaryButtonHref:"#",badge:"New",imageUrl:"",imageAlt:"Card image",styles:{}})},"Reset")))}function N({hostEl:t,initialConfig:i}){const[r,l]=e.useState(i),c=e.useRef(i);e.useEffect(()=>{c.current=r},[r]),e.useEffect(()=>{const o=p=>{if(p.detail&&typeof p.detail=="object"){const b=p.detail,E=JSON.stringify(c.current),h=JSON.stringify(b);E!==h&&l(b)}},m=()=>{const p=C(t.getAttribute("data-config")),b=JSON.stringify(c.current),E=JSON.stringify(p);b!==E&&l(p)};t.addEventListener("cti:config-change",o);const v=new MutationObserver(()=>{m()});return v.observe(t,{attributes:!0,attributeFilter:["data-config"]}),()=>{t.removeEventListener("cti:config-change",o),v.disconnect()}},[t]);const d=e.useMemo(()=>({title:r.title??"Dynamic Card",subtitle:r.subtitle??"",description:r.description??"This is a fully dynamic card component with customizable content and styles.",primaryButtonText:r.primaryButtonText??"Primary Action",primaryButtonHref:r.primaryButtonHref??"#",secondaryButtonText:r.secondaryButtonText??"Secondary Action",secondaryButtonHref:r.secondaryButtonHref??"#",imageUrl:r.imageUrl??"",imageAlt:r.imageAlt??"Card image",badge:r.badge??""}),[r]),[s,g]=e.useState(()=>B(t));e.useEffect(()=>{if(s)return;let o=0;const m=window.setInterval(()=>{o+=1,B(t)?(g(!0),window.clearInterval(m)):o>=20&&window.clearInterval(m)},250);return()=>window.clearInterval(m)},[s,t]);const[x,f]=e.useState(!1);e.useEffect(()=>{s&&f(!0)},[s]);const a=async o=>{if(l(o),s&&(t.setAttribute("data-config",_(o)),t.dispatchEvent(new CustomEvent("cti:config-change",{detail:o,bubbles:!0})),window.parent&&window.parent!==window)){const m=t.tagName.toLowerCase();window.parent.postMessage({type:"configChanged",payload:{componentId:m,config:o}},"*")}};return e.createElement("div",{className:"cti-dynamic-card-host"},e.createElement("style",null,`
        .cti-dynamic-card-host { position: relative; display: block; }
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
      `),e.createElement(y,{...d,styles:r.styles}),s&&e.createElement(e.Fragment,null,e.createElement("button",{className:"cti-toggle-btn",onClick:()=>f(o=>!o)},x?"Close Inspector":"Open Inspector"),x&&e.createElement(U,{value:r,onChange:a})))}class J extends HTMLElement{constructor(){super(...arguments);L(this,"root",null)}static get observedAttributes(){return["data-config"]}connectedCallback(){const r=document.createElement("div");this.appendChild(r);const l=C(this.getAttribute("data-config")),c=u.createRoot(r);this.root=c,c.render(e.createElement(N,{hostEl:this,initialConfig:l}))}disconnectedCallback(){var r;(r=this.root)==null||r.unmount()}attributeChangedCallback(r,l,c){if(r==="data-config"&&this.root){const d=C(c);this.root.render(e.createElement(N,{hostEl:this,initialConfig:d}))}}}customElements.define("cti-dynamic-card",J)})(React,ReactDOMClient);
