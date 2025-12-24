/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/admin/theme/versions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface ThemeVersion {
  versionId: string;
  timestamp: string;
  author: string;
  componentId: string;
  description: string;
  env: string;
}

/**
 * GET /api/admin/theme/versions
 * List all theme versions with audit info
 */
export async function GET(request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const logFile = path.join(logsDir, "theme-audit.jsonl");

    let versions: ThemeVersion[] = [];

    try {
      const content = await fs.readFile(logFile, "utf-8");
      versions = content
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line))
        .reverse(); // Most recent first
    } catch {
      // File doesn't exist yet
    }

    return NextResponse.json({
      success: true,
      total: versions.length,
      versions,
    });
  } catch (error) {
    console.error("[API] Failed to fetch versions:", error);
    return NextResponse.json(
      { error: "Failed to fetch versions" },
      { status: 500 }
    );
  }
}
