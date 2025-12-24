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

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const componentId = params.component as string;
  const containerRef = useRef<HTMLDivElement>(null);
  const webComponentRef = useRef<HTMLElement | null>(null);

  // Parse initial tokens from URL
  const initialTokens = searchParams.get("tokens")
    ? JSON.parse(decodeURIComponent(searchParams.get("tokens")!))
    : {};

  useEffect(() => {
    // Load Web Component bundle
    const loadComponent = async () => {
      try {
        // Fetch manifest to get bundle URL
        const manifest = await fetch("/manifest.admin.json").then((r) =>
          r.json()
        );
        const component = manifest.registry.find(
          (c: any) => c.id === componentId
        );

        if (!component) {
          console.error(`Component ${componentId} not found in manifest`);
          return;
        }

        // Load the script
        const script = document.createElement("script");
        script.src = component.bundle;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
          renderComponent(component);
        };

        script.onerror = () => {
          console.error(`Failed to load ${component.bundle}`);
        };
      } catch (error) {
        console.error("Failed to load component manifest:", error);
      }
    };

    loadComponent();
  }, [componentId]);

  const renderComponent = (component: any) => {
    if (!containerRef.current) return;

    // Create the web component element
    const tagName = componentId
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();

    const el = document.createElement(tagName);

    // Set initial props from URL or defaults
    component.props?.forEach((prop: any) => {
      const urlValue = searchParams.get(`prop_${prop.name}`);
      el.setAttribute(prop.name, urlValue || prop.default);
    });

    webComponentRef.current = el;
    containerRef.current.appendChild(el);
  };

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
              event.origin
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
            event.origin
          );
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <html>
      <head>
        <title>{componentId} Preview</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f9fafb;
            padding: 2rem;
          }

          #preview-container {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 2rem;
            min-height: 400px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          /* Apply initial tokens */
          ${Object.entries(initialTokens)
            .map(([varName, value]) => `--${varName}: ${value};`)
            .join("\n")}
        `}</style>
      </head>
      <body>
        <div id="preview-container" ref={containerRef} />
      </body>
    </html>
  );
}
