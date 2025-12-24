/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { readThemeFile, writeThemeFile } from "../../../src/lib/themeFile";

const CDN_REFRESH_URL =
  process.env.CDN_REFRESH_URL || "http://localhost:4000/refresh-cache";

export async function GET() {
  const theme = await readThemeFile();
  return NextResponse.json(theme);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // اینجا می‌توانی validate کنی (مثلاً وجود tokens, components, ...)
    await writeThemeFile(body);

    // بعد از آپدیت فایل، به CDN بگو cache این فایل را refresh کند
    try {
      await fetch(CDN_REFRESH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ⚠️ دقت کن: مسیر logical همان چیزی است که client از CDN می‌گیرد
        body: JSON.stringify({ filePath: "api/theme.json" }),
      });
      // console.log("CDN cache refresh requested for api/theme.json");
    } catch (err: any) {
      console.error("⚠️ CDN refresh failed (ادامه می‌دهیم):", err.message);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Write theme error", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 }
    );
  }
}
