/* eslint-disable @typescript-eslint/no-explicit-any */
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
      docs?: string;
      notes?: string;
    };
  };
};
