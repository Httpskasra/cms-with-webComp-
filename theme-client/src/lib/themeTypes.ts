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

// export interface ComponentProp {
//   name: string;
//   type: string;
//   default: any;
//   options?: string[];
// }

export type Manifest = {
  version: string;
  registry: ComponentRegistry[];
  designTokens: Record<string, any>;
};

export type ComponentRegistry = {
  id: string;
  name: string;
  bundle: string;
  version: string;
  description: string;
  props?: any[];
  cssVars?: any[];
};

type ComponentProp = {
  name: string
  type: string
  default?: string
}

type CssVar = {
  name: string;
  default?: string;
  type: string;
};

type ComponentDefinition = {
  id: string;
  name: string;
  bundle: string;
  version: string;
  description?: string;
  props?: ComponentProp[];
  cssVars?: CssVar[];
};
export type ThemeJSON = {
  version: number | string;
  tokens: {
    colors: Record<string, string>;
    spacing: Record<string, string>;
    radius: Record<string, string>;
  };

  components: Record<string, ComponentDefinition>;
  // components: {
  //   [componentName: string]: {
  //     base?: React.CSSProperties;
  //     variants?: {
  //       [variantName: string]: React.CSSProperties;
  //     };
  //     className?: string;
  //     props?: Record<string, any>;
  //     bundle?: string;
  //   };
  // };
  // components: {
  //   [componentName: string]: {
  //     base?: React.CSSProperties;
  //     variants?: {
  //       [variantName: string]: React.CSSProperties;
  //     };
  //     className?: string;
  //     props?: Record<string, any>;
  //   };
  // };
};
