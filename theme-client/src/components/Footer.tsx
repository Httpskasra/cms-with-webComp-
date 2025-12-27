// /* eslint-disable react-hooks/refs */
// /* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import React, { useEffect, useRef } from "react";
// import { useTheme } from "../contexts/ThemeContext";
// import { getComponentById } from "../lib/manifestClient";

// function loadOnce(src: string) {
//   if (document.querySelector(`script[data-wc="${src}"]`)) return;
//   const s = document.createElement("script");
//   s.type = "text/javascript";
//   s.defer = true;
//   s.src = src;
//   s.setAttribute("data-wc", src);
//   document.body.appendChild(s);
// }

// export function FooterWidget() {
//   const theme = useTheme();

//   const ref = useRef<any>(null);

//   useEffect(() => {
//     let cancelled = false;

//     async function loadBundle() {
//       const mode =
//         theme?.components?.["cti-footer"]?.props?.mode ||
//         theme?.components?.Footer?.props?.mode ||
//         "modal";

//       // Try to get bundle from registry via CDN
//       try {
//         const comp = await getComponentById("cti-footer");
//         const bundle =
//           comp?.bundle ||
//           `${
//             process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000"
//           }/wc/cti-footer-${mode}.js`;
//         if (!cancelled) loadOnce(bundle);
//       } catch (err) {
//         const fallback = `${
//           process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000"
//         }/wc/cti-footer-${mode}.js`;
//         if (!cancelled) loadOnce(fallback);
//       }
//     }

//     loadBundle();
//     return () => {
//       cancelled = true;
//     };
//   }, [theme?.components]);

//   useEffect(() => {
//     if (!ref.current) return;

//     const cfg =
//       theme?.components?.["cti-footer"]?.props ||
//       theme?.components?.Footer?.props ||
//       {};
//     ref.current.setAttribute("data-config", JSON.stringify(cfg));
//   }, [theme]);

//   const mode =
//     theme?.components?.["cti-footer"]?.props?.mode ||
//     theme?.components?.Footer?.props?.mode ||
//     "modal";
//   const element = `cti-footer-${mode}`;

//   return React.createElement(element, { ref });
// }

"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
function loadOnce(src: string) {
  if (document.querySelector(`script[data-wc="${src}"]`)) return;
  const s = document.createElement("script");
  // s.type = "module";
  s.type = "text/javascript";
  s.defer = true;
  s.src = src;
  s.setAttribute("data-wc", src);
  document.body.appendChild(s);
}

export function FooterWidget() {
  const theme = useTheme();

  const ref = useRef<any>(null);

  useEffect(() => {
    const mode = theme?.components?.Footer?.props?.mode || "modal";
    const src = `http://localhost:4000/wc/cti-footer-${mode}.js`;
    loadOnce(src);
  }, [theme?.components?.Footer?.props?.mode]);
  useEffect(() => {
    if (!ref.current) return;

    const cfg = theme?.components?.Footer?.props || {};

    // ✅ صحیح: HTML attributes را تنظیم کنید
    // if (cfg.buttonText)
    //   ref.current.setAttribute("data-button-text", cfg.buttonText);
    // if (cfg.modalTitle)
    //   ref.current.setAttribute("data-modal-title", cfg.modalTitle);
    // if (cfg.modalBody)
    //   ref.current.setAttribute("data-modal-body", cfg.modalBody);
    // if (cfg.hoverLabel)
    //   ref.current.setAttribute("data-hover-label", cfg.hoverLabel);
    // if (cfg.dropdownItems)
    //   ref.current.setAttribute("data-items", JSON.stringify(cfg.dropdownItems));
    ref.current.setAttribute("data-config", JSON.stringify(cfg));
  }, [theme]);

  const mode = theme?.components?.Footer?.props?.mode || "modal";
  const element = `cti-footer-${mode}`;

  return React.createElement(element, { ref });
}
