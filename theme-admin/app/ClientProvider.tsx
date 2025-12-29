"use client";

import React, { useEffect } from "react";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set CDN base URL for dev overrides
    (window as any).__CTI_CDN_URL__ =
      process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
  }, []);

  return <>{children}</>;
}
