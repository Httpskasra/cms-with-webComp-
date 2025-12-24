"use client";

import { HTMLAttributes } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { getComponentStyle } from "../lib/componentStyles";

type Props = HTMLAttributes<HTMLHeadingElement> & {
  variant?: "primary" | "secondary";
};

export function Header({ style, ...rest }: Props) {
  const theme = useTheme();
  const config = getComponentStyle(theme, "Header1");
  // console.log("conf", config.className);

  return (
    <h1
      {...rest}
      className={[config.className, rest.className].filter(Boolean).join(" ")}
      style={{
        ...(config.base ?? {}),
        ...style,
      }}>
      dalam
    </h1>
  );
}
