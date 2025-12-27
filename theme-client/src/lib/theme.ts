/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ThemeJSON } from "./themeTypes";

export async function fetchTheme(): Promise<ThemeJSON> {
  // Prefer explicit theme URL (legacy). If not set, fall back to CDN site.json
  const themeUrl = process.env.NEXT_PUBLIC_THEME_URL;
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
  const url = themeUrl || `${cdnUrl}/site`;

  console.log("🔗 Fetching theme from:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch theme: ${res.status} ${res.statusText}`);
    }

    const raw = await res.json();

    // If we fetched site.json, normalize into ThemeJSON shape expected by the app
    if (raw.designTokens && raw.registry) {
      const tokens = {
        colors: Object.fromEntries(
          Object.entries(raw.designTokens.colors || {}).map(([k, v]: any) => [
            k,
            v.value || v,
          ])
        ),
        spacing: Object.fromEntries(
          Object.entries(raw.designTokens.spacing || {}).map(([k, v]: any) => [
            k,
            v.value || v,
          ])
        ),
        radius: Object.fromEntries(
          Object.entries(raw.designTokens.radius || {}).map(([k, v]: any) => [
            k,
            v.value || v,
          ])
        ),
      };

      const components: Record<string, any> = {};
      (raw.registry || []).forEach((comp: any) => {
        const propsRecord: Record<string, any> = {};
        (comp.props || []).forEach(
          (p: any) => (propsRecord[p.name] = p.default)
        );
        components[comp.id] = {
          props: propsRecord,
        };
      });

      const json: ThemeJSON = {
        version: raw.version || 1,
        tokens,
        components,
      };

      console.log("✅ Theme (from site.json) normalized");
      return json;
    }

    // Otherwise assume it's already ThemeJSON
    return raw as ThemeJSON;
  } catch (err) {
    console.error(
      "❌ Error fetching theme:",
      err instanceof Error ? err.message : String(err)
    );
    throw err;
  }
}
