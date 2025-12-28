// components/admin/ComponentPreview.tsx

"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { ComponentRegistry } from "@/src/lib/manifestClient";

interface ComponentPreviewProps {
  component: ComponentRegistry;
  props: Record<string, any>;
}

export default function ComponentPreview({
  component,
  props,
}: ComponentPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  // console.log("yoho haha ", component.bundle);
  // Create element tag name from component id (e.g., "cti-footer" -> "cti-footer")
  const tagName = component.id
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  // Build preview URL with props as query params
  const previewUrl = `/admin/preview/${component.id}?${new URLSearchParams(
    Object.entries(props).map(([key, value]) => [`prop_${key}`, String(value)])
  ).toString()}`;

  // Send props to iframe when component mounts or props change
  useEffect(() => {
    if (iframeLoaded && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "setProps",
          payload: props,
        },
        window.location.origin
      );
    }
  }, [props, iframeLoaded]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Live Preview</h2>
        <div className="border-2 border-dashed border-slate-300 rounded-lg overflow-hidden bg-slate-50 min-h-96">
          <iframe
            ref={iframeRef}
            src={previewUrl}
            onLoad={() => setIframeLoaded(true)}
            className="w-full h-96 border-0"
            title={`${component.name} Preview`}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">HTML Output</h3>
        <code className="text-xs text-blue-800 break-words block overflow-x-auto">
          {`<${tagName}${Object.entries(props)
            .filter(
              ([, value]) =>
                value !== "" && value !== null && value !== undefined
            )
            .map(([key, value]) => ` ${key}="${value}"`)
            .join("")} />`}
        </code>
      </div>

      <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
        <h3 className="font-semibold text-slate-900 mb-2">Preview URL</h3>
        <code className="text-xs text-slate-700 break-all block">
          {previewUrl}
        </code>
      </div>
    </div>
  );
}
