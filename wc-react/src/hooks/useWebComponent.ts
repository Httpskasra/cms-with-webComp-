import React, { useEffect, useRef } from "react";

export function useWebComponent(element: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = element.current;
    if (!el) return;

    // فراخوانی lifecycle callbacks
    if (el.dispatchEvent) {
      el.dispatchEvent(new CustomEvent("connected"));
    }

    return () => {
      if (el.dispatchEvent) {
        el.dispatchEvent(new CustomEvent("disconnected"));
      }
    };
  }, [element]);
}
