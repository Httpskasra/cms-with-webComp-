import React from "react";

interface CTIFooterProps {
  children?: React.ReactNode;
}

export const CTIFooter: React.FC<CTIFooterProps> = ({ children }) => {
  return (
    <footer
      style={{
        width: "100%",
        background: "var(--footer-bg, #fff)",
        color: "var(--footer-text, #111827)",
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      }}>
      {children}
    </footer>
  );
};
