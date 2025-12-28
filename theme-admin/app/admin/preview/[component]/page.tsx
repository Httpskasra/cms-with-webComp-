/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/preview/[component]/page.tsx
// This is a dev-only preview page that runs inside an iframe
// It dynamically loads and renders a Web Component with live token updates

"use client";

import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";

interface PreviewMessage {
  type: "setProps" | "setTokens" | "getComputedStyles" | "exportTheme";
  payload: any;
}

// Extend window object to include React libraries
declare global {
  interface Window {
    React: any;
    ReactDOMClient: any;
    ReactDOM: any;
  }
}

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const componentId = params.component as string;
  const containerRef = useRef<HTMLDivElement>(null);
  const webComponentRef = useRef<HTMLElement | null>(null);

  const renderComponent = (component: any) => {
    if (!containerRef.current) return;

    // Create the web component element
    const tagName = componentId
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();

    // Wait for web component to be defined in customElements registry
    const waitForWebComponent = (
      name: string,
      maxWait: number = 5000
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (customElements.get(name)) {
          console.log(`✅ Web component '${name}' already registered`);
          resolve();
          return;
        }

        const startTime = Date.now();
        const checkInterval = setInterval(() => {
          if (customElements.get(name)) {
            clearInterval(checkInterval);
            console.log(`✅ Web component '${name}' registered`);
            resolve();
          } else if (Date.now() - startTime > maxWait) {
            clearInterval(checkInterval);
            reject(
              new Error(
                `Web component '${name}' not registered after ${maxWait}ms`
              )
            );
          }
        }, 50); // Check every 50ms
      });
    };

    waitForWebComponent(tagName)
      .then(() => {
        const el = document.createElement(tagName);

        // Set initial props from URL or defaults
        component.props?.forEach((prop: any) => {
          const urlValue = searchParams.get(`prop_${prop.name}`);
          el.setAttribute(prop.name, urlValue || prop.default);
        });

        webComponentRef.current = el;
        containerRef.current?.appendChild(el);
        console.log(`✅ Component rendered: ${tagName}`);
      })
      .catch((err) => {
        console.error(`❌ Failed to render component: ${err.message}`);
      });
  };

  useEffect(() => {
    // Load Web Component bundle
    const loadComponent = async () => {
      try {
        console.log(`🚀 Loading component: ${componentId}`);

        // Load React dependencies first if needed

        // Add extra safety check
        if (!window.React || !window.ReactDOMClient) {
          throw new Error("React dependencies failed to load");
        }

        console.log(`✅ React ready, fetching manifest...`);

        // Fetch manifest from Virtual CDN
        const cdnUrl = "http://localhost:4000/manifest/admin";
        const response = await fetch(cdnUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch manifest: ${response.status}`);
        }

        const manifest = await response.json();
        const component = manifest.registry.find(
          (c: any) => c.id === componentId
        );

        if (!component) {
          console.error(`Component ${componentId} not found in manifest`);
          return;
        }

        console.log(`✅ Component found, loading bundle...`);

        // Load the script from CDN
        const bundleUrl = component.bundle.startsWith("http")
          ? component.bundle
          : `http://localhost:4000${component.bundle}`;
        const script = document.createElement("script");
        script.src = bundleUrl;
        script.async = false; // ✅ Make sure React is fully available before executing
        document.head.appendChild(script);

        script.onload = () => {
          console.log(`✅ Bundle loaded: ${componentId}`);
          renderComponent(component);
        };

        script.onerror = () => {
          console.error(`Failed to load bundle: ${bundleUrl}`);
        };
      } catch (error) {
        console.error("Failed to load component manifest:", error);
      }
    };

    loadComponent();
  }, [componentId]);

  // Listen for messages from parent Admin page
  useEffect(() => {
    const handleMessage = (event: MessageEvent<PreviewMessage>) => {
      if (event.origin !== window.location.origin) return;

      const { type, payload } = event.data;

      switch (type) {
        case "setProps":
          // Update Web Component props
          if (webComponentRef.current && payload) {
            Object.entries(payload).forEach(([key, value]) => {
              webComponentRef.current?.setAttribute(key, String(value));
            });
          }
          break;

        case "setTokens":
          // Update CSS custom properties
          if (payload) {
            const root = document.documentElement;
            Object.entries(payload).forEach(([varName, value]) => {
              root.style.setProperty(varName, String(value));
            });
          }
          break;

        case "getComputedStyles":
          // Return computed styles of the component
          if (webComponentRef.current) {
            const styles = window.getComputedStyle(webComponentRef.current);
            event.source?.postMessage(
              {
                type: "computedStyles",
                payload: {
                  display: styles.display,
                  color: styles.color,
                  backgroundColor: styles.backgroundColor,
                },
              },
              { targetOrigin: event.origin }
            );
          }
          break;

        case "exportTheme":
          // Export current theme state
          const root = document.documentElement;
          const theme: Record<string, string> = {};
          payload?.variables?.forEach((varName: string) => {
            const value = root.style.getPropertyValue(varName);
            if (value) theme[varName] = value;
          });
          event.source?.postMessage(
            {
              type: "themeExport",
              payload: theme,
            },
            { targetOrigin: event.origin }
          );
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <div id="preview-container" ref={containerRef} />
    </>
  );
}
