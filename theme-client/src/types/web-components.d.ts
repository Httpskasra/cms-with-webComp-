// src/types/web-components.d.ts
import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "cti-footer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        // اگر property خاصی مثل config داری، می‌تونی اینجا هم تایپش بدی:
        // config?: any;
      };
    }
  }
}

export {};
