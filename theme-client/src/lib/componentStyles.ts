import type { ThemeJSON } from "./themeTypes";
import type { CSSProperties } from "react";

export type ComponentStyleConfig = {
  base?: CSSProperties;
  variantStyle?: CSSProperties;
  className?: string;
};
export function getComponentStyle(
  theme: ThemeJSON,
  component: string,
  variant?: string
): ComponentStyleConfig {
  const comp = theme.components[component];
  if (!comp) return {};

  const base = comp.base ?? {};
  const variantStyle =
    variant && comp.variants && comp.variants[variant]
      ? comp.variants[variant]
      : {};
  const className = comp.className || "";
  // console.log("asdadas", comp);
  // console.log("asdad111111111111as", className);
  //   console.log(base, variantStyle);
  return {
    base,
    variantStyle,
    className,
  };
}
