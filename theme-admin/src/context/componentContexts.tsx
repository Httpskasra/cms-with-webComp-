"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type PropsMap = Record<string, string>;

export interface ComponentContextValue {
  cdnUrl: string;
  setCdnUrl: (next: string) => void;

  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;

  previewProps: PropsMap;
  setPreviewProps: (p: PropsMap) => void;

  buildPreviewUrl: (componentId: string, props?: PropsMap) => string;
  toTagName: (componentId: string) => string;
}

const Ctx = createContext<ComponentContextValue | null>(null);

function toKebabCase(input: string): string {
  if (input.includes("-")) return input.toLowerCase();
  return input
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function ComponentProvider({ children }: { children: React.ReactNode }) {
  const [cdnUrl, setCdnUrl] = useState(
    process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000"
  );

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );

  const [previewProps, setPreviewProps] = useState<PropsMap>({});

  const value = useMemo<ComponentContextValue>(() => {
    return {
      cdnUrl,
      setCdnUrl,
      selectedComponentId,
      setSelectedComponentId,
      previewProps,
      setPreviewProps,
      toTagName: toKebabCase,
      buildPreviewUrl: (componentId: string, props: PropsMap = {}) => {
        const qs = new URLSearchParams(
          Object.entries(props).map(([k, v]) => [`prop_${k}`, String(v)])
        ).toString();

        return `/admin/preview/${componentId}${qs ? `?${qs}` : ""}`;
      },
    };
  }, [cdnUrl, selectedComponentId, previewProps]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useComponentContext(): ComponentContextValue {
  const v = useContext(Ctx);
  if (!v)
    throw new Error(
      "useComponentContext must be used within ComponentProvider"
    );
  return v;
}
