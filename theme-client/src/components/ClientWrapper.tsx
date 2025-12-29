"use client";

import { ReactNode, useEffect } from "react";
import { initWCGlobals } from "@/wc/wc-globals";

export function ClientWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    initWCGlobals();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const isAdminPreview = url.searchParams.get("adminPreview") === "1";
    if (!isAdminPreview) return;

    (window as any).__CTI_WC_DEV__ = true;

    const adminOrigin = url.searchParams.get("adminOrigin") || "*";
    const isAllowedOrigin = (origin: string) =>
      adminOrigin === "*" || origin === adminOrigin;

    let selectedEl: HTMLElement | null = null;

    const setSelected = (el: HTMLElement | null) => {
      if (selectedEl && selectedEl !== el) {
        selectedEl.removeAttribute("data-admin-selected");
      }
      selectedEl = el;
      if (selectedEl) {
        selectedEl.setAttribute("data-admin-selected", "1");
      }
    };

    const findComponentFromPath = (
      path: EventTarget[]
    ): HTMLElement | null => {
      for (const item of path) {
        if (item instanceof HTMLElement) {
          const tag = item.tagName.toLowerCase();
          if (tag.startsWith("cti-")) return item;
        }
      }
      return null;
    };

    const resolveTarget = (componentId?: string): HTMLElement | null => {
      if (componentId) {
        const selector = String(componentId).toLowerCase();
        return document.querySelector(selector) as HTMLElement | null;
      }
      return selectedEl;
    };

    const resolveTargets = (componentId?: string): HTMLElement[] => {
      if (componentId) {
        const selector = String(componentId).toLowerCase();
        return Array.from(document.querySelectorAll(selector)) as HTMLElement[];
      }
      return selectedEl ? [selectedEl] : [];
    };

    const handleClick = (event: MouseEvent) => {
      const path = event.composedPath ? event.composedPath() : [];
      const target = findComponentFromPath(path);
      if (!target) return;

      event.preventDefault();
      event.stopPropagation();

      setSelected(target);

      const componentId = target.tagName.toLowerCase();
      window.parent?.postMessage(
        { type: "componentSelected", payload: { componentId } },
        adminOrigin === "*" ? "*" : adminOrigin
      );
    };

    const handleMessage = (event: MessageEvent) => {
      if (!isAllowedOrigin(event.origin)) return;
      const data = event.data || {};

      if (data.type === "setCssVars") {
        const cssVars = data.payload?.cssVars ?? data.payload;
        const targets = resolveTargets(data.payload?.componentId);
        if (targets.length === 0 || !cssVars) return;

        targets.forEach((target) => {
          Object.entries(cssVars).forEach(([varName, value]) => {
            if (value === "" || value == null) {
              target.style.removeProperty(varName);
            } else {
              target.style.setProperty(varName, String(value));
            }
          });
        });
      }

      if (data.type === "setProps") {
        const props = data.payload?.props ?? data.payload;
        const target = resolveTarget(data.payload?.componentId);
        if (!target || !props) return;

        Object.entries(props).forEach(([key, value]) => {
          target.setAttribute(key, String(value));
        });
      }

      if (data.type === "setTokens") {
        const tokens = data.payload || {};
        const root = document.documentElement;
        Object.entries(tokens).forEach(([varName, value]) => {
          root.style.setProperty(varName, String(value));
        });
      }
    };

    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-admin-preview", "1");
    styleEl.textContent =
      '[data-admin-selected="1"]{outline:2px solid #f97316;outline-offset:2px;}';
    document.head.appendChild(styleEl);

    document.addEventListener("click", handleClick, true);
    window.addEventListener("message", handleMessage);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("message", handleMessage);
      styleEl.remove();
    };
  }, []);

  return children;
}
