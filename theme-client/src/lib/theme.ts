import type { ThemeJSON } from "./themeTypes";

export async function fetchTheme(): Promise<ThemeJSON> {
  const url = process.env.NEXT_PUBLIC_THEME_URL!;
  
  if (!url) {
    throw new Error("NEXT_PUBLIC_THEME_URL is not set");
  }

  console.log("🔗 Fetching theme from:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store", // ✅ هر بار از CDN دریافت کن، کش نکن
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch theme: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as ThemeJSON;
    console.log("✅ Theme fetched successfully");
    return json;
  } catch (err) {
    console.error("❌ Error fetching theme:", err instanceof Error ? err.message : String(err));
    throw err;
  }
}
