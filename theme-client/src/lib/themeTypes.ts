/* eslint-disable @typescript-eslint/no-explicit-any */

// ⚠️ Client-side types - NO admin documentation included

export interface DesignToken {
  value: string;
  type: string;
}

export interface CSSVariable {
  name: string;
  default: string;
  type: "color" | "dimension" | "string";
}

export interface ComponentProp {
  name: string;
  type: string;
  default: any;
  options?: string[];
}

export interface ComponentRegistry {
  id: string;
  name: string;
  bundle: string;
  version: string;
  description: string;
  props: ComponentProp[];
  cssVars: CSSVariable[];
}

export interface PublicManifest {
  version: string;
  registry: ComponentRegistry[];
  designTokens: Record<string, Record<string, DesignToken>>;
}

export type ThemeJSON = {
  version: number | string;
  tokens: {
    colors: Record<string, string>;
    spacing: Record<string, string>;
    radius: Record<string, string>;
  };
  components: {
    [componentName: string]: {
      base?: React.CSSProperties;
      variants?: {
        [variantName: string]: React.CSSProperties;
      };
      className?: string;
      props?: Record<string, any>;
    };
  };
};
