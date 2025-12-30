// /* eslint-disable react-hooks/refs */
// /* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useRef } from "react";

function loadOnce(src: string) {
  if (document.querySelector(`script[data-wc="${src}"]`)) return;
  const s = document.createElement("script");
  s.type = "text/javascript";
  s.defer = true;
  s.src = src;
  s.setAttribute("data-wc", src);
  document.body.appendChild(s);
}

export function DinamicCard() {
  const ref = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBundle() {
      try {
        const bundle = `${
          process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000"
        }/wc/cti-dynamic-card.js`;
        if (bundle) {
          if (!cancelled) loadOnce(bundle);
          return;
        }

        const fallbackBundle = `${
          process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000"
        }/wc/cti-dynamic-card.js`;
        if (!cancelled) loadOnce(fallbackBundle);
      } catch {
        const fallback = `${
          process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000"
        }/wc/cti-dynamic-card.js`;
        if (!cancelled) loadOnce(fallback);
      }
    }

    loadBundle();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load config from CDN and poll for changes
  useEffect(() => {
    if (!ref.current) return;

    let lastConfigHash = "";

    const loadConfig = async () => {
      try {
        const cdnUrl =
          process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
        const res = await fetch(
          `${cdnUrl}/config/components/cti-dynamic-card`,
          {
            cache: "no-store",
          }
        );
        const data = await res.json();
        const config = data?.config || {};

        const configStr = JSON.stringify(config);
        const configHash = configStr;

        // Only update if config actually changed
        if (configHash !== lastConfigHash && ref.current) {
          lastConfigHash = configHash;
          if (Object.keys(config).length > 0) {
            ref.current.setAttribute("data-config", configStr);
            // Trigger config change event
            ref.current.dispatchEvent(
              new CustomEvent("cti:config-change", {
                detail: config,
                bubbles: true,
              })
            );
          }
        }
      } catch (err) {
        console.warn("Failed to load config from CDN:", err);
      }
    };

    // Initial load
    const timeout = setTimeout(loadConfig, 100);

    // Poll for changes every 2 seconds (only in dev/admin preview mode)
    const isDev =
      process.env.NODE_ENV === "development" ||
      (typeof window !== "undefined" &&
        new URL(window.location.href).searchParams.get("adminPreview") === "1");

    let pollInterval: NodeJS.Timeout | null = null;
    if (isDev) {
      pollInterval = setInterval(loadConfig, 2000);
    }

    return () => {
      clearTimeout(timeout);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  const element = `cti-dynamic-card`;

  const isDev = process.env.NODE_ENV === "development"; // در next dev = true، در next start = false
  const isAdminPreview =
    typeof window !== "undefined" &&
    new URL(window.location.href).searchParams.get("adminPreview") === "1";

  return React.createElement(element, {
    ref,
    ...(isDev || isAdminPreview ? { "data-inspector": "1" } : {}),
  });
}

// "use client";

// import React, { useEffect, useRef } from "react";
// import { useTheme } from "../contexts/ThemeContext";
// function loadOnce(src: string) {
//   if (document.querySelector(`script[data-wc="${src}"]`)) return;
//   const s = document.createElement("script");
//   // s.type = "module";
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
//     const mode = theme?.components?.Footer?.props?.mode || "modal";
//     const src = `http://localhost:4000/wc/cti-footer-${mode}.js`;
//     loadOnce(src);
//   }, [theme?.components?.Footer?.props?.mode]);
//   useEffect(() => {
//     if (!ref.current) return;

//     const cfg = theme?.components?.Footer?.props || {};

//     // ✅ صحیح: HTML attributes را تنظیم کنید
//     // if (cfg.buttonText)
//     //   ref.current.setAttribute("data-button-text", cfg.buttonText);
//     // if (cfg.modalTitle)
//     //   ref.current.setAttribute("data-modal-title", cfg.modalTitle);
//     // if (cfg.modalBody)
//     //   ref.current.setAttribute("data-modal-body", cfg.modalBody);
//     // if (cfg.hoverLabel)
//     //   ref.current.setAttribute("data-hover-label", cfg.hoverLabel);
//     // if (cfg.dropdownItems)
//     //   ref.current.setAttribute("data-items", JSON.stringify(cfg.dropdownItems));
//     ref.current.setAttribute("data-config", JSON.stringify(cfg));
//   }, [theme]);

//   const mode = theme?.components?.Footer?.props?.mode || "modal";
//   const element = `cti-footer-${mode}`;

//   return React.createElement(element, { ref });
// }
