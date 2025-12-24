// lib/admin/themeVersioning.ts - Version management for themes

import crypto from "crypto";

export interface ThemeVersion {
  id: string;
  hash: string;
  timestamp: number;
  author?: string;
  description?: string;
  tokens: Record<string, any>;
  overrides: Record<string, any>;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  author: string;
  action: "CREATE" | "UPDATE" | "PUBLISH" | "ROLLBACK";
  componentId?: string;
  changes: Record<string, any>;
  versionId: string;
}

export function generateVersionHash(data: any): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex")
    .substring(0, 8);
}

export function generateVersionId(): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:T.]/g, "")
    .substring(0, 14); // YYYYMMDDHHmmss
  const hash = generateVersionHash({ time: Date.now(), random: Math.random() });
  return `v${timestamp}_${hash}`;
}

export function getVersionedAssetPath(
  assetName: string,
  versionId: string,
  env: string = "dev"
): string {
  // Returns path like: api/theme/dev/v20251224_143022_3f91c2.css
  const ext = assetName.includes(".") ? "" : ".css";
  return `/api/theme/${env}/${versionId}/${assetName}${ext}`;
}

export function getCacheBustUrl(path: string, versionId: string): string {
  // Returns versioned URL with query param for cache busting
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${versionId}`;
}
