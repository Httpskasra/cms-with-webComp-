var F=Object.defineProperty;var $=(e,u,x)=>u in e?F(e,u,{enumerable:!0,configurable:!0,writable:!0,value:x}):e[u]=x;var L=(e,u,x)=>$(e,typeof u!="symbol"?u+"":u,x);(function(e,u){"use strict";const x=({title:t="Dynamic Card",subtitle:o="",description:r="This is a fully dynamic card component with customizable content and styles.",primaryButtonText:l="Primary Action",primaryButtonHref:c="#",secondaryButtonText:m="Secondary Action",secondaryButtonHref:d="#",imageUrl:g="",imageAlt:E="Card image",badge:f="",styles:a={}})=>e.createElement("div",{className:"cti-dynamic-card",style:a.container},e.createElement("style",null,`
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
      `),e.createElement("div",{className:"card-wrap",style:a.card},f&&e.createElement("div",{className:"badge",style:a.badge},f),g&&e.createElement("div",{className:"image-container"},e.createElement("img",{src:g,alt:E,className:"card-image",style:a.image})),e.createElement("div",{className:"content"},t&&e.createElement("h2",{className:"title",style:a.title},t),o&&e.createElement("h3",{className:"subtitle",style:a.subtitle},o),r&&e.createElement("p",{className:"description",style:a.description},r),(l||m)&&e.createElement("div",{className:"buttons",style:a.buttonsContainer},l&&e.createElement("a",{href:c,className:"btn btn-primary",style:a.primaryButton,target:"_blank",rel:"noreferrer"},l),m&&e.createElement("a",{href:d,className:"btn btn-secondary",style:a.secondaryButton,target:"_blank",rel:"noreferrer"},m)))));function B(t){const o=t.getAttribute("data-inspector");if(o==="1"||o==="true")return!0;const r=globalThis;return!!(r&&r.__CTI_WC_DEV__===!0)}function C(t){if(!t)return{};try{const o=JSON.parse(t);return o&&typeof o=="object"?o:{}}catch{return{}}}function M(t){try{return JSON.stringify(t)}catch{return"{}"}}function U({value:t,onChange:o}){var s,b,p,y,v,h,k,S,T,I,D,z,A,_,O,H;const r=e.useRef(null),[l,c]=e.useState({x:10,y:10}),[m,d]=e.useState(!1),g=e.useRef({x:0,y:0}),E=n=>{n.stopPropagation(),d(!0);const w=r.current.getBoundingClientRect();g.current={x:n.clientX-w.left,y:n.clientY-w.top},n.preventDefault()},f=n=>{m&&c({x:n.clientX-g.current.x,y:n.clientY-g.current.y})},a=()=>d(!1);e.useEffect(()=>(window.addEventListener("mousemove",f),window.addEventListener("mouseup",a),()=>{window.removeEventListener("mousemove",f),window.removeEventListener("mouseup",a)}),[m]);const i=(n,w,j)=>{var P;o({...t,styles:{...t.styles,[n]:{...(P=t.styles)==null?void 0:P[n],[w]:j}}})};return e.createElement("div",{ref:r,className:"cti-dev-inspector",style:{transform:`translate(${l.x}px, ${l.y}px)`}},e.createElement("style",null,`
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
      `),e.createElement("div",{className:"head",style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}},e.createElement("div",null,e.createElement("div",{className:"ttl",style:{fontSize:"14px",fontWeight:700}},"DEV Inspector: cti-dynamic-card"),e.createElement("div",{className:"hint",style:{fontSize:"11px",opacity:.7}},"Use Drag button to move")),e.createElement("button",{className:"drag-btn",onMouseDown:E},"Drag")),e.createElement("div",{className:"grid"},e.createElement("div",{className:"section"},e.createElement("div",{className:"section-title"},"Content"),e.createElement("div",{style:{marginBottom:"12px"}},e.createElement("label",null,"Title"),e.createElement("input",{value:t.title??"",onChange:n=>o({...t,title:n.target.value}),placeholder:"Card title..."})),e.createElement("div",{style:{marginBottom:"12px"}},e.createElement("label",null,"Subtitle"),e.createElement("input",{value:t.subtitle??"",onChange:n=>o({...t,subtitle:n.target.value}),placeholder:"Card subtitle..."})),e.createElement("div",{style:{marginBottom:"12px"}},e.createElement("label",null,"Description"),e.createElement("textarea",{value:t.description??"",onChange:n=>o({...t,description:n.target.value}),placeholder:"Card description..."})),e.createElement("div",{className:"row2",style:{marginBottom:"12px"}},e.createElement("div",null,e.createElement("label",null,"Badge"),e.createElement("input",{value:t.badge??"",onChange:n=>o({...t,badge:n.target.value}),placeholder:"New"})),e.createElement("div",null,e.createElement("label",null,"Image URL"),e.createElement("input",{value:t.imageUrl??"",onChange:n=>o({...t,imageUrl:n.target.value}),placeholder:"https://..."}))),e.createElement("div",null,e.createElement("label",null,"Image Alt Text"),e.createElement("input",{value:t.imageAlt??"",onChange:n=>o({...t,imageAlt:n.target.value}),placeholder:"Image description"}))),e.createElement("div",{className:"section"},e.createElement("div",{className:"section-title"},"Buttons"),e.createElement("div",{className:"row2",style:{marginBottom:"12px"}},e.createElement("div",null,e.createElement("label",null,"Primary Button Text"),e.createElement("input",{value:t.primaryButtonText??"",onChange:n=>o({...t,primaryButtonText:n.target.value}),placeholder:"Primary Action"})),e.createElement("div",null,e.createElement("label",null,"Primary Button Href"),e.createElement("input",{value:t.primaryButtonHref??"",onChange:n=>o({...t,primaryButtonHref:n.target.value}),placeholder:"https://..."}))),e.createElement("div",{className:"row2"},e.createElement("div",null,e.createElement("label",null,"Secondary Button Text"),e.createElement("input",{value:t.secondaryButtonText??"",onChange:n=>o({...t,secondaryButtonText:n.target.value}),placeholder:"Secondary Action"})),e.createElement("div",null,e.createElement("label",null,"Secondary Button Href"),e.createElement("input",{value:t.secondaryButtonHref??"",onChange:n=>o({...t,secondaryButtonHref:n.target.value}),placeholder:"https://..."})))),e.createElement("div",{className:"section"},e.createElement("div",{className:"section-title"},"Styles"),e.createElement("div",{style:{marginBottom:"12px"}},e.createElement("label",null,"Card Background"),e.createElement("input",{type:"color",value:((b=(s=t.styles)==null?void 0:s.card)==null?void 0:b.backgroundColor)||"#ffffff",onChange:n=>i("card","backgroundColor",n.target.value)})),e.createElement("div",{className:"row2",style:{marginBottom:"12px"}},e.createElement("div",null,e.createElement("label",null,"Title Color"),e.createElement("input",{type:"color",value:((y=(p=t.styles)==null?void 0:p.title)==null?void 0:y.color)||"#111827",onChange:n=>i("title","color",n.target.value)})),e.createElement("div",null,e.createElement("label",null,"Subtitle Color"),e.createElement("input",{type:"color",value:((h=(v=t.styles)==null?void 0:v.subtitle)==null?void 0:h.color)||"#6b7280",onChange:n=>i("subtitle","color",n.target.value)}))),e.createElement("div",{style:{marginBottom:"12px"}},e.createElement("label",null,"Description Color"),e.createElement("input",{type:"color",value:((S=(k=t.styles)==null?void 0:k.description)==null?void 0:S.color)||"#4b5563",onChange:n=>i("description","color",n.target.value)})),e.createElement("div",{className:"row2",style:{marginBottom:"12px"}},e.createElement("div",null,e.createElement("label",null,"Primary Button Background"),e.createElement("input",{type:"color",value:((I=(T=t.styles)==null?void 0:T.primaryButton)==null?void 0:I.backgroundColor)||"#3b82f6",onChange:n=>i("primaryButton","backgroundColor",n.target.value)})),e.createElement("div",null,e.createElement("label",null,"Primary Button Text Color"),e.createElement("input",{type:"color",value:((z=(D=t.styles)==null?void 0:D.primaryButton)==null?void 0:z.color)||"#ffffff",onChange:n=>i("primaryButton","color",n.target.value)}))),e.createElement("div",{className:"row2"},e.createElement("div",null,e.createElement("label",null,"Secondary Button Background"),e.createElement("input",{type:"color",value:((_=(A=t.styles)==null?void 0:A.secondaryButton)==null?void 0:_.backgroundColor)||"#e5e7eb",onChange:n=>i("secondaryButton","backgroundColor",n.target.value)})),e.createElement("div",null,e.createElement("label",null,"Secondary Button Text Color"),e.createElement("input",{type:"color",value:((H=(O=t.styles)==null?void 0:O.secondaryButton)==null?void 0:H.color)||"#111827",onChange:n=>i("secondaryButton","color",n.target.value)}))))),e.createElement("div",{className:"actions"},e.createElement("button",{type:"button",onClick:()=>o({title:"Dynamic Card",subtitle:"Subtitle",description:"This is a fully dynamic card component.",primaryButtonText:"Primary Action",primaryButtonHref:"#",secondaryButtonText:"Secondary Action",secondaryButtonHref:"#",badge:"New",imageUrl:"",imageAlt:"Card image",styles:{}})},"Reset")))}function N({hostEl:t,initialConfig:o}){const[r,l]=e.useState(o),c=e.useRef(o);e.useEffect(()=>{c.current=r},[r]),e.useEffect(()=>{const i=p=>{if(p.detail&&typeof p.detail=="object"){const y=p.detail,v=JSON.stringify(c.current),h=JSON.stringify(y);v!==h&&l(y)}},s=()=>{const p=C(t.getAttribute("data-config")),y=JSON.stringify(c.current),v=JSON.stringify(p);y!==v&&l(p)};t.addEventListener("cti:config-change",i);const b=new MutationObserver(()=>{s()});return b.observe(t,{attributes:!0,attributeFilter:["data-config"]}),()=>{t.removeEventListener("cti:config-change",i),b.disconnect()}},[t]);const m=e.useMemo(()=>({title:r.title??"Dynamic Card",subtitle:r.subtitle??"",description:r.description??"This is a fully dynamic card component with customizable content and styles.",primaryButtonText:r.primaryButtonText??"Primary Action",primaryButtonHref:r.primaryButtonHref??"#",secondaryButtonText:r.secondaryButtonText??"Secondary Action",secondaryButtonHref:r.secondaryButtonHref??"#",imageUrl:r.imageUrl??"",imageAlt:r.imageAlt??"Card image",badge:r.badge??""}),[r]),[d,g]=e.useState(()=>B(t));e.useEffect(()=>{if(d)return;let i=0;const s=window.setInterval(()=>{i+=1,B(t)?(g(!0),window.clearInterval(s)):i>=20&&window.clearInterval(s)},250);return()=>window.clearInterval(s)},[d,t]);const[E,f]=e.useState(!1);e.useEffect(()=>{d&&f(!0)},[d]);const a=async i=>{if(l(i),d){t.setAttribute("data-config",M(i)),t.dispatchEvent(new CustomEvent("cti:config-change",{detail:i,bubbles:!0}));try{const s=globalThis.__CTI_CDN_URL__||"http://localhost:4000",b=t.tagName.toLowerCase();await fetch(`${s}/config/components/${b}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({config:i})}),window.parent&&window.parent!==window&&window.parent.postMessage({type:"configChanged",payload:{componentId:b,config:i}},"*")}catch(s){console.warn("Failed to save config to CDN:",s)}}};return e.createElement("div",{className:"cti-dynamic-card-host"},e.createElement("style",null,`
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
      `),e.createElement(x,{...m,styles:r.styles}),d&&e.createElement(e.Fragment,null,e.createElement("button",{className:"cti-toggle-btn",onClick:()=>f(i=>!i)},E?"Close Inspector":"Open Inspector"),E&&e.createElement(U,{value:r,onChange:a})))}class J extends HTMLElement{constructor(){super(...arguments);L(this,"root",null)}static get observedAttributes(){return["data-config"]}connectedCallback(){const r=document.createElement("div");this.appendChild(r);const l=C(this.getAttribute("data-config")),c=u.createRoot(r);this.root=c,c.render(e.createElement(N,{hostEl:this,initialConfig:l}))}disconnectedCallback(){var r;(r=this.root)==null||r.unmount()}attributeChangedCallback(r,l,c){if(r==="data-config"&&this.root){const m=C(c);this.root.render(e.createElement(N,{hostEl:this,initialConfig:m}))}}}customElements.define("cti-dynamic-card",J)})(React,ReactDOMClient);
