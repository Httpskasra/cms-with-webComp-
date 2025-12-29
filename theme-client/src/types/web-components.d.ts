// src/types/web-components.d.ts
import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "cti-footer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        // config?: any;
      };
      "cti-footer-hover": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "cti-footer-modal": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export {};
