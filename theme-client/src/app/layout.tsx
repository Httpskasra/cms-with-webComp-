import type { ReactNode } from "react";
import { fetchTheme } from "../lib/theme";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ClientWrapper } from "@/components/ClientWrapper";

export const metadata = {
  title: "Client App with CDN Theme",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const theme = await fetchTheme(); // روی سرور، با cache

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
