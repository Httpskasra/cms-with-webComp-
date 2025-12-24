// src/lib/manifestClient.ts
// Client-safe manifest loader - filters out admin-only data

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
    const res = await fetch(`${cdnUrl}/manifest/public`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status}`);

    const manifest = await res.json();

    // Filter out any admin-only data
    const filtered: Manifest = {
      version: manifest.version,
      registry: manifest.registry.map((comp: any) => ({
        id: comp.id,
        name: comp.name,
        bundle: comp.bundle,
        version: comp.version,
        description: comp.description,
        props: comp.props || [],
        cssVars: comp.cssVars || [],
        // NO docs, slots, events, adminOnly flag
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
  const manifest = await getPublicManifest();
  return manifest.registry.find((c) => c.id === id);
}

export async function getAllComponents(): Promise<ComponentRegistry[]> {
  const manifest = await getPublicManifest();
  return manifest.registry;
}
