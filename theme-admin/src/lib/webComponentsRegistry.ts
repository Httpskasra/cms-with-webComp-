export type WebComponentRecord = {
  name: string;
  version: string;
  lastPublishedAt?: string;
  cachedVersion?: string;
  docs?: string;
  metadata?: Record<string, unknown>;
};

const REGISTRY_URL =
  process.env.WEB_COMPONENT_REGISTRY_URL ||
  "http://localhost:4000/registry/web-components.json";

export async function fetchRegistryComponents(): Promise<WebComponentRecord[]> {
  console.log("📥 Fetching from:", REGISTRY_URL);

  const response = await fetch(REGISTRY_URL, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load web components from registry (${response.status})`
    );
  }

  const payload = await response.json();
  console.log("📦 Raw payload:", JSON.stringify(payload, null, 2));

  const list: unknown = Array.isArray(payload)
    ? payload
    : (payload as { components?: unknown }).components;

  if (!Array.isArray(list)) {
    throw new Error(
      `Registry response does not contain a components array. Got: ${typeof list}`
    );
  }

  console.log("✅ Found", list.length, "components");
  return list.map((item) => normalizeComponentEntry(item));
}

function normalizeComponentEntry(entry: unknown): WebComponentRecord {
  if (typeof entry !== "object" || !entry) {
    throw new Error("Invalid registry entry");
  }

  const typed = entry as Record<string, unknown>;
  return {
    name: String(typed.name || "unknown"),
    version: String(typed.version || typed.latest || "0.0.0"),
    lastPublishedAt: typed.lastPublishedAt
      ? String(typed.lastPublishedAt)
      : undefined,
    cachedVersion: typed.cachedVersion
      ? String(typed.cachedVersion)
      : undefined,
    docs: typed.docs ? String(typed.docs) : undefined,
    metadata: typed.metadata as Record<string, unknown> | undefined,
  };
}
