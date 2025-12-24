// app/api/admin/theme/rollback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface RollbackRequest {
  versionId: string;
  env: string;
}

/**
 * POST /api/admin/theme/rollback
 * Rollback to a previous theme version
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RollbackRequest;
    const { versionId, env = "dev" } = body;

    if (!versionId) {
      return NextResponse.json(
        { error: "versionId is required" },
        { status: 400 }
      );
    }

    // Find the version in audit log
    const logsDir = path.join(process.cwd(), "logs");
    const logFile = path.join(logsDir, "theme-audit.jsonl");

    const content = await fs.readFile(logFile, "utf-8");
    const versions = content
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));

    const versionEntry = versions.find(
      (v: any) => v.versionId === versionId && v.env === env
    );

    if (!versionEntry) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    // Create a new rollback entry in audit log
    const rollbackEntry = {
      versionId: `rollback_${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: "admin",
      action: "ROLLBACK",
      rolledBackFrom: versionId,
      componentId: versionEntry.componentId,
      env,
      originalData: versionEntry,
    };

    await fs.appendFile(logFile, JSON.stringify(rollbackEntry) + "\n", "utf-8");

    // Copy the original CSS file to a new rollback version
    const cacheDir = path.join(process.cwd(), "..", "virtual-cdn", "cache");
    const originalFile = path.join(cacheDir, `theme_${env}_${versionId}.css`);
    const rollbackFile = path.join(
      cacheDir,
      `theme_${env}_${rollbackEntry.versionId}.css`
    );

    const cssContent = await fs.readFile(originalFile, "utf-8");
    await fs.writeFile(rollbackFile, cssContent, "utf-8");

    return NextResponse.json({
      success: true,
      message: `Rolled back to version ${versionId}`,
      rollbackVersion: rollbackEntry.versionId,
      originalVersion: versionId,
    });
  } catch (error) {
    console.error("[API] Rollback error:", error);
    return NextResponse.json(
      {
        error: "Failed to rollback",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
