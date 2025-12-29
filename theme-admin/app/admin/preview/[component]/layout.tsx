"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactDOMClient from "react-dom/client";

// Assign dependencies to window for web components

export default function previewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (typeof window !== "undefined") {
    (window as any).React = React;
    (window as any).ReactDOMClient = ReactDOMClient;
    (window as any).__CTI_WC_DEV__ = true;
  }
  return <>{children}</>;
}
