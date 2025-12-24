/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { readThemeFile, writeThemeFile } from "../../../src/lib/themeFile";
import {
  enforceDevOnly,
  startPublishJob,
} from "../../../src/lib/publishJobs";

export async function GET() {
  const devGuard = enforceDevOnly();
  if (devGuard) return devGuard;

  const theme = await readThemeFile();
  return NextResponse.json(theme);
}

export async function POST(req: Request) {
  const devGuard = enforceDevOnly();
  if (devGuard) return devGuard;

  try {
    const body = await req.json();
    // اینجا می‌توانی validate کنی (مثلاً وجود tokens, components, ...)
    await writeThemeFile(body);

    const requestedBy = req.headers.get("x-admin-user") || "dev-user";
    const job = startPublishJob({
      component: "theme.json",
      requestedBy,
    });

    return NextResponse.json({ success: true, job });
  } catch (e: any) {
    console.error("Write theme error", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 }
    );
  }
}
