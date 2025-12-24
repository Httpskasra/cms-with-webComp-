/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/admin/theme/generate/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import {
  generateVersionHash,
  generateVersionId,
  getVersionedAssetPath,
} from "@/src/lib/themeVersioning";
import { promises as fs } from "fs";
import path from "path";

interface TokenUpdate {
  varName: string;
  value: string;
}

interface ThemeGenerateRequest {
  componentId: string;
  tokens: Record<string, string>;
  author?: string;
  description?: string;
  env?: "dev" | "prod";
}

/**
 * Generate CSS theme file from tokens
 * Creates versioned CSS file and updates CDN cache
 * Returns new version info for cache busting
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ThemeGenerateRequest;
    const {
      componentId,
      tokens,
      author = "admin",
      description = "",
      env = "dev",
    } = body;

    if (!componentId || !tokens || Object.keys(tokens).length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: componentId, tokens" },
        { status: 400 }
      );
    }

    // 1. Generate version ID and hash
    const versionId = generateVersionId();
    const hash = generateVersionHash({ componentId, tokens });

    // 2. Build CSS content from tokens
    const cssContent = buildCSSFromTokens(componentId, tokens);

    // 3. Save to local cache (will be picked up by virtual-cdn)
    const cacheDir = path.join(process.cwd(), "..", "virtual-cdn", "cache");
    await ensureDir(cacheDir);

    const filename = `theme_${env}_${versionId}.css`;
    const filepath = path.join(cacheDir, filename);

    await fs.writeFile(filepath, cssContent, "utf-8");

    // 4. Log audit trail
    await logAuditTrail({
      versionId,
      author,
      componentId,
      tokens,
      description,
      env,
      timestamp: Date.now(),
    });

    // 5. Return version info for client-side cache busting
    return NextResponse.json({
      success: true,
      version: versionId,
      hash,
      assetPath: getVersionedAssetPath(`theme_${env}`, versionId, env),
      cssFile: filename,
      url: `http://localhost:4000/cdn/api/theme/${env}/${filename}`,
      message: `Theme published for ${componentId} in ${env} environment`,
    });
  } catch (error) {
    console.error("[API] Theme generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate theme",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Build CSS content from design tokens and CSS variables
 */
function buildCSSFromTokens(
  componentId: string,
  tokens: Record<string, string>
): string {
  let css = `/* Generated Theme - ${componentId} */\n`;
  css += `/* Generated: ${new Date().toISOString()} */\n\n`;

  css += `:root {\n`;
  Object.entries(tokens).forEach(([varName, value]) => {
    css += `  ${varName}: ${value};\n`;
  });
  css += `}\n\n`;

  // Component-specific overrides
  css += `/* Component-specific styles */\n`;
  css += `${componentId} {\n`;
  css += `  /* Add component-specific rules here */\n`;
  css += `}\n`;

  return css;
}

/**
 * Ensure directory exists
 */
async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Log audit trail to file
 */
async function logAuditTrail(data: any): Promise<void> {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    await ensureDir(logsDir);

    const logFile = path.join(logsDir, "theme-audit.jsonl");
    const line = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
    });

    await fs.appendFile(logFile, line + "\n", "utf-8");
  } catch (error) {
    console.error("[API] Audit log error:", error);
    // Don't fail the request if logging fails
  }
}
