"use client";

import { ReactNode, useEffect } from "react";
import { initWCGlobals } from "@/wc/wc-globals";

export function ClientWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    initWCGlobals();
  }, []);

  return children;
}
