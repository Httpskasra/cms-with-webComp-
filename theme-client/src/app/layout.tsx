import type { ReactNode } from "react";
import { fetchTheme } from "../lib/theme";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ClientWrapper } from "@/components/ClientWrapper";

export const metadata = {
  title: "Client App with CDN Theme",
};

// Fallback theme in case fetch fails
const FALLBACK_THEME = {
  version: 1,
  tokens: {
    colors: {
      primary: "#4f46e5",
      secondary: "#f97316",
      background: "#ffffff",
      text: "#111827",
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "12px",
      lg: "16px",
      xl: "24px",
    },
    radius: {
      sm: "4px",
      md: "8px",
      lg: "9999px",
    },
  },
  components: {},
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  let theme = FALLBACK_THEME;

  try {
    const fetchedTheme = await fetchTheme(); // روی سرور، با cache
    theme = {
      ...fetchedTheme,
      version:
        typeof fetchedTheme.version === "string"
          ? parseInt(fetchedTheme.version, 10)
          : fetchedTheme.version,
    };
    console.log("✅ Theme loaded successfully");
  } catch (err) {
    console.error("❌ Failed to fetch theme, using fallback:", err);
  }

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          // href="https://hillz-cms-files.s3.ca-central-1.amazonaws.com/cms/dealerships/1/global/output.css"
          href="http://localhost:4000/cdn/globals.css"
        />
      </head>
      <body>
        <ThemeProvider value={theme}>
          <ClientWrapper>{children}</ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
