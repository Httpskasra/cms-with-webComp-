// src/lib/manifestClient.ts
// Client-safe manifest loader - filters out admin-only data
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Manifest, ComponentRegistry } from "./themeTypes";

let cachedManifest: Manifest | null = null;

/**
 * Fetch PUBLIC manifest from CDN
 * Admin docs are never loaded on client
 */
export async function getPublicManifest(): Promise<Manifest> {
  if (cachedManifest) {
    return cachedManifest;
  }

  try {
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
    // Use new site endpoint which contains designTokens + minimal registry
    const res = await fetch(`${cdnUrl}/site`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status}`);

    const manifest = await res.json();

    // Already lightweight - ensure shape matches Manifest used by client
    const filtered: Manifest = {
      version: manifest.version,
      registry: (manifest.registry || []).map((comp: any) => ({
        id: comp.id,
        name: comp.name,
        bundle: comp.bundle,
        version: comp.version,
        description: comp.description,
        props: comp.props || [],
        cssVars: comp.cssVars || [],
      })),
      designTokens: manifest.designTokens || {},
    };

    cachedManifest = filtered;
    return filtered;
  } catch (error) {
    console.error("Failed to load public manifest:", error);
    throw error;
  }
}

export async function getComponentById(
  id: string
): Promise<ComponentRegistry | undefined> {
  // Try to fetch detailed component JSON from CDN (includes cssVars/docs if available)
  try {
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
    const res = await fetch(`${cdnUrl}/components/${id}`, {
      cache: "no-store",
    });
    if (res.ok) return (await res.json()) as ComponentRegistry;
  } catch (err) {
    // ignore and fallback
    throw err;
  }

  const manifest = await getPublicManifest();
  return manifest.registry.find((c) => c.id === id);
}

export async function getAllComponents(): Promise<ComponentRegistry[]> {
  const manifest = await getPublicManifest();
  return manifest.registry;
}
