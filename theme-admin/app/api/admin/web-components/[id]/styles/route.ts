import { NextResponse } from "next/server";
import { readThemeFile, writeThemeFile } from "../../../../../../src/lib/themeFile";

const CDN_REFRESH_URL =
  process.env.CDN_REFRESH_URL || "http://localhost:4000/refresh-cache";

type WebComponentStates = {
  hover: boolean;
  focus: boolean;
  disabled: boolean;
};

type WebComponentStylePayload = {
  cssVariables: Record<string, string>;
  tokens: Record<string, string>;
  variant: string;
  size: string;
  states: WebComponentStates;
};

type ThemeFile = {
  webComponentsStyles?: Record<string, WebComponentStylePayload>;
  [key: string]: unknown;
};

function defaultStyle(): WebComponentStylePayload {
  return {
    cssVariables: {
      "--cta-bg": "#4f46e5",
      "--cta-color": "#ffffff",
      "--surface": "#f9fafb",
    },
    tokens: {
      "primary.color": "#4f46e5",
      "text.muted": "#4b5563",
    },
    variant: "primary",
    size: "md",
    states: {
      hover: false,
      focus: false,
      disabled: false,
    },
  };
}

function sanitizePayload(body: unknown): WebComponentStylePayload {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid payload");
  }

  const payload = body as Partial<WebComponentStylePayload>;
  return {
    cssVariables: payload.cssVariables ?? {},
    tokens: payload.tokens ?? {},
    variant: payload.variant ?? "primary",
    size: payload.size ?? "md",
    states: {
      hover: payload.states?.hover ?? false,
      focus: payload.states?.focus ?? false,
      disabled: payload.states?.disabled ?? false,
    },
  };
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const theme = (await readThemeFile()) as ThemeFile;
  const styles = theme.webComponentsStyles?.[id] ?? defaultStyle();

  return NextResponse.json(styles);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const cleaned = sanitizePayload(body);
    const theme = (await readThemeFile()) as ThemeFile;
    const nextTheme: ThemeFile = {
      ...theme,
      webComponentsStyles: {
        ...(theme.webComponentsStyles ?? {}),
        [id]: cleaned,
      },
    };

    await writeThemeFile(nextTheme);

    try {
      await fetch(CDN_REFRESH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: `api/admin/web-components/${id}/styles`,
        }),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("CDN refresh failed (ignored)", message);
    }

    return NextResponse.json({ success: true, styles: cleaned });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Save styles error", e);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
