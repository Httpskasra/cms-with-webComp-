/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";

const SITE_FILE_PATH = path.join(
  process.cwd(),
  "..",
  "virtual-cdn",
  "cache",
  "site.json"
);

const CDN_REFRESH_URL =
  process.env.CDN_REFRESH_URL || "http://localhost:4000/refresh-cache";

async function readSiteFile() {
  try {
    const content = await fs.readFile(SITE_FILE_PATH, "utf-8");
    return JSON.parse(content);
  } catch (err: any) {
    console.error("Error reading site.json:", err.message);
    return null;
  }
}

async function writeSiteFile(data: any) {
  try {
    await fs.writeFile(SITE_FILE_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (err: any) {
    console.error("Error writing site.json:", err.message);
    return false;
  }
}

export async function GET() {
  const site = await readSiteFile();
  if (!site) {
    return NextResponse.json(
      { error: "Failed to read site.json" },
      { status: 500 }
    );
  }
  return NextResponse.json(site);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Write the updated data to site.json
    const success = await writeSiteFile(body);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to write site.json" },
        { status: 500 }
      );
    }

    // After updating the file, notify CDN to refresh cache
    try {
      await fetch(CDN_REFRESH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: "site.json" }),
      });
      // console.log("CDN cache refresh requested for site.json");
    } catch (err: any) {
      console.error("⚠️ CDN refresh failed (ادامه می‌دهیم):", err.message);
    }

    return NextResponse.json({
      success: true,
      message: "Site.json updated successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
