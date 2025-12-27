/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/admin/manifestClient.ts - Fetch and cache manifest

export interface ComponentProp {
  name: string;
  type: string;
  default: any;
  description?: string;
  options?: string[];
}

export interface CSSVar {
  name: string;
  default: string;
  type: "color" | "dimension" | "string";
  description?: string;
}

export interface ComponentDoc {
  adminOnly: boolean;
  overview?: string;
  usage?: string;
  examples?: Array<{
    title: string;
    code: string;
  }>;
  accessibility?: string;
  browserSupport?: string;
}

export interface ComponentRegistry {
  id: string;
  name: string;
  bundle: string;
  version: string;
  description: string;
  adminOnly?: boolean;
  props: ComponentProp[];
  cssVars: CSSVar[];
  slots?: Array<{ name: string; description?: string }>;
  events?: Array<{ name: string; description?: string }>;
  docs?: ComponentDoc;
}

export interface DesignToken {
  value: string;
  description?: string;
  type: string;
}

export interface Manifest {
  version: string;
  registry: ComponentRegistry[];
  designTokens: Record<string, Record<string, DesignToken>>;
  overrides?: {
    enabled: boolean;
    path: string;
    description: string;
  };
}

let cachedAdminManifest: Manifest | null = null;
let cachedPublicManifest: Manifest | null = null;

export async function getAdminManifest(): Promise<Manifest> {
  if (cachedAdminManifest !== null) {
    return cachedAdminManifest as Manifest;
  }

  try {
    // Use the new components index endpoint which is lighter-weight and meant for admin search
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
    const getAllComponentsUrl = `${cdnUrl}/components/index`;
    const res = await fetch(getAllComponentsUrl, {
      cache: "no-store",
    });

    if (!res.ok)
      throw new Error(`Failed to fetch components index: ${res.status}`);

    const index = await res.json();

    // Normalize into existing Manifest shape where possible. designTokens might come from /site
    cachedAdminManifest = {
      version: index.version,
      registry: index.registry as ComponentRegistry[],
      designTokens: {},
    };

    return cachedAdminManifest as Manifest;
  } catch (error) {
    console.error("Failed to load components index:", error);
    throw error;
  }
}

export async function getPublicManifest(): Promise<Manifest> {
  if (cachedPublicManifest !== null) {
    return cachedPublicManifest as Manifest;
  }

  try {
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
    const getPublicManifestUrl = `${cdnUrl}/manifest/public`;
    const res = await fetch(getPublicManifestUrl, {
      cache: "no-store",
    });

    if (!res.ok)
      throw new Error(`Failed to fetch public manifest: ${res.status}`);

    cachedPublicManifest = await res.json();
    return cachedPublicManifest as Manifest;
  } catch (error) {
    console.error("Failed to load public manifest:", error);
    throw error;
  }
}

export async function getComponentById(
  id: string,
  adminOnly: boolean = true
): Promise<ComponentRegistry | undefined> {
  // Fetch individual component JSON when more detail is required (docs, cssVars, slots, events)
  try {
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
    const componentIdUrl = `${cdnUrl}/components/${id}`;
    const res = await fetch(componentIdUrl, { cache: "no-store" });
    if (!res.ok) return undefined;
    const comp = await res.json();
   
    return comp as ComponentRegistry;
  } catch (err) {
    console.error("Failed to fetch component:", err);
    return undefined;
  }
}

export async function getAllComponents(
  adminOnly: boolean = true
): Promise<ComponentRegistry[]> {
  const manifest = adminOnly
    ? await getAdminManifest()
    : await getPublicManifest();
  return manifest.registry;
}

export async function getDesignTokens(): Promise<
  Record<string, Record<string, DesignToken>>
> {
  try {
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
    const siteUrl = `${cdnUrl}/site`;
    const res = await fetch(siteUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch site.json: ${res.status}`);
    const site = await res.json();
    return site.designTokens || {};
  } catch (err) {
    console.error("Failed to load design tokens:", err);
    // Fallback to admin manifest tokens if available
    const manifest = await getAdminManifest();
    return manifest.designTokens || {};
  }
}
