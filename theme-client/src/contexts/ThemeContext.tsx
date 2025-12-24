"use client";

import React, { createContext, useContext } from "react";
import type { ThemeJSON } from "../lib/themeTypes";

const ThemeContext = createContext<ThemeJSON | null>(null);

export function ThemeProvider({
  value,
  children,
}: {
  value: ThemeJSON;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
