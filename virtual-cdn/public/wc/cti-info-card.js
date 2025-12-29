var k=Object.defineProperty;var D=(e,l,p)=>l in e?k(e,l,{enumerable:!0,configurable:!0,writable:!0,value:p}):e[l]=p;var y=(e,l,p)=>D(e,typeof l!="symbol"?l+"":l,p);(function(e,l){"use strict";const p=({title:t="Info Card",description:r="This is a reusable info card web component.",ctaText:n="Learn more",ctaHref:s="#",styles:i={}})=>e.createElement("div",{className:"cti-info-card"},e.createElement("div",{className:"wrap",style:i.card},e.createElement("h3",{className:"title",style:i.title},t),e.createElement("p",{className:"desc",style:i.description},r),e.createElement("a",{className:"cta",href:s,target:"_blank",rel:"noreferrer",style:i.cta},n,e.createElement("span",{"aria-hidden":"true"},"→"))));function h(t){const r=t.getAttribute("data-inspector");if(r==="1"||r==="true")return!0;const n=globalThis;return!!(n&&n.__CTI_WC_DEV__===!0)}function C(t){if(!t)return{};try{const r=JSON.parse(t);return r&&typeof r=="object"?r:{}}catch{return{}}}function w(t){try{return JSON.stringify(t)}catch{return"{}"}}function I({value:t,onChange:r}){var b,x,E,v;const n=e.useRef(null),[s,i]=e.useState({x:10,y:10}),[d,m]=e.useState(!1),u=e.useRef({x:0,y:0}),f=o=>{o.stopPropagation(),m(!0);const c=n.current.getBoundingClientRect();u.current={x:o.clientX-c.left,y:o.clientY-c.top},o.preventDefault()},a=o=>{d&&i({x:o.clientX-u.current.x,y:o.clientY-u.current.y})},g=()=>m(!1);return e.useEffect(()=>(window.addEventListener("mousemove",a),window.addEventListener("mouseup",g),()=>{window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",g)}),[d]),e.createElement("div",{ref:n,className:"cti-dev-inspector",style:{transform:`translate(${s.x}px, ${s.y}px)`}},e.createElement("style",null,`
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
      `),e.createElement("div",{className:"head",style:{display:"flex",alignItems:"center",justifyContent:"space-between"}},e.createElement("div",null,e.createElement("div",{className:"ttl"},"DEV Inspector: cti-info-card"),e.createElement("div",{className:"hint"},"Use Drag button to move")),e.createElement("button",{className:"drag-btn",onMouseDown:f},"Drag")),e.createElement("div",{className:"grid"},e.createElement("div",null,e.createElement("label",null,"Title"),e.createElement("input",{value:t.title??"",onChange:o=>r({...t,title:o.target.value}),placeholder:"Card title..."})),e.createElement("div",null,e.createElement("label",null,"Description"),e.createElement("textarea",{value:t.description??"",onChange:o=>r({...t,description:o.target.value}),placeholder:"Card description..."})),e.createElement("div",{className:"row2"},e.createElement("div",null,e.createElement("label",null,"CTA Text"),e.createElement("input",{value:t.ctaText??"",onChange:o=>r({...t,ctaText:o.target.value}),placeholder:"Learn more"})),e.createElement("div",null,e.createElement("label",null,"CTA Href"),e.createElement("input",{value:t.ctaHref??"",onChange:o=>r({...t,ctaHref:o.target.value}),placeholder:"https://..."}))),e.createElement("div",null,e.createElement("label",null,"Card Background"),e.createElement("input",{type:"color",value:((x=(b=t.styles)==null?void 0:b.card)==null?void 0:x.backgroundColor)||"#ffffff",onChange:o=>{var c;return r({...t,styles:{...t.styles,card:{...(c=t.styles)==null?void 0:c.card,backgroundColor:o.target.value}}})}})),e.createElement("div",null,e.createElement("label",null,"Title Color"),e.createElement("input",{type:"color",value:((v=(E=t.styles)==null?void 0:E.title)==null?void 0:v.color)||"#111827",onChange:o=>{var c;return r({...t,styles:{...t.styles,title:{...(c=t.styles)==null?void 0:c.title,color:o.target.value}}})}}))),e.createElement("div",{className:"actions"},e.createElement("button",{type:"button",onClick:()=>r({title:"Info Card",description:"This is a reusable info card web component.",ctaText:"Learn more",ctaHref:"#",styles:{}})},"Reset")))}function T({hostEl:t,initialConfig:r}){const[n,s]=e.useState(r),i=e.useMemo(()=>({title:n.title??"Info Card",description:n.description??"This is a reusable info card web component.",ctaText:n.ctaText??"Learn more",ctaHref:n.ctaHref??"#"}),[n]),d=e.useMemo(()=>h(t),[t]),[m,u]=e.useState(!1);e.useEffect(()=>{d&&u(!0)},[d]);const f=a=>{s(a),d&&(t.setAttribute("data-config",w(a)),t.dispatchEvent(new CustomEvent("cti:config-change",{detail:a,bubbles:!0})))};return e.createElement("div",{className:"cti-info-card-host"},e.createElement("style",null,`
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
      `),e.createElement(p,{...i,styles:n.styles}),d&&e.createElement(e.Fragment,null,e.createElement("button",{className:"cti-toggle-btn",onClick:()=>u(a=>!a)},m?"Close Inspector":"Open Inspector"),m&&e.createElement(I,{value:n,onChange:f})))}class N extends HTMLElement{constructor(){super(...arguments);y(this,"root",null)}connectedCallback(){const n=document.createElement("div");this.appendChild(n);const s=C(this.getAttribute("data-config")),i=l.createRoot(n);this.root=i,i.render(e.createElement(T,{hostEl:this,initialConfig:s}))}disconnectedCallback(){var n;(n=this.root)==null||n.unmount()}}customElements.define("cti-info-card",N)})(React,ReactDOMClient);
