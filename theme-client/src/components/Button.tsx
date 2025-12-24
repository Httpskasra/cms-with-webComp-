"use client";

import { ButtonHTMLAttributes } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { getComponentStyle } from "../lib/componentStyles";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", style, ...rest }: Props) {
  const theme = useTheme();
  const themedCfg  = getComponentStyle(theme, "Button", variant);

  return (
    <button
      {...rest}
      style={{
        ...(themedCfg.base ?? {}),
        ...(themedCfg.variantStyle ?? {}),
        ...style, // override دستی
      }}
    />
  );
}
