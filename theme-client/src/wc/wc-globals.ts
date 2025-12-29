/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button_raw } from "@/components/Button_raw";
import { TitleComp } from "@/components/Title";
declare global {
  interface Window {
    React?: any;
    ReactDOMClient?: any;
    CTI?: { components?: Record<string, any> };
    __CTI_CDN_URL__?: string;
  }
}

export async function initWCGlobals() {
  if (typeof window === "undefined") return;

  // Set CDN base URL for dev overrides
  (window as any).__CTI_CDN_URL__ =
    process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";

  // react-dom/client را اینجا lazy-load کن تا SSR هیچوقت نخورد
  const ReactDOMClient = await import("react-dom/client");

  window.React = React;
  window.ReactDOMClient = ReactDOMClient;

  window.CTI = window.CTI || {};
  window.CTI.components = window.CTI.components || {};
  window.CTI.components.Button_raw = Button_raw;
  window.CTI.components.TitleComp = TitleComp;
  console.log(window.CTI.components);
}
