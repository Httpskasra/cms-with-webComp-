/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { readThemeFile } from "../../../src/lib/themeFile";

export async function GET() {
  try {
    const theme = await readThemeFile();
    return NextResponse.json(theme, {
      status: 200,
      headers: {
        "Cache-Control": "no-store", // Origin؛ کش اصلی را CDN انجام می‌دهد
      },
    });
  } catch (e: any) {
    console.error("Theme read error", e);
    return NextResponse.json({ error: "Cannot read theme" }, { status: 500 });
  }
}
