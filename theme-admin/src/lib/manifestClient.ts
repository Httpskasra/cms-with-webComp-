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
    const res = await fetch("/manifest.admin.json", {
      cache: "no-store",
    });

    if (!res.ok)
      throw new Error(`Failed to fetch admin manifest: ${res.status}`);

    cachedAdminManifest = await res.json();
    return cachedAdminManifest as Manifest;
  } catch (error) {
    console.error("Failed to load admin manifest:", error);
    throw error;
  }
}

export async function getPublicManifest(): Promise<Manifest> {
  if (cachedPublicManifest !== null) {
    return cachedPublicManifest as Manifest;
  }

  try {
    const res = await fetch("/manifest.public.json", {
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
  const manifest = adminOnly
    ? await getAdminManifest()
    : await getPublicManifest();
  return manifest.registry.find((c) => c.id === id);
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
  const manifest = await getAdminManifest();
  return manifest.designTokens;
}
