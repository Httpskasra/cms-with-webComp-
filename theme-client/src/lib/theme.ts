import type { ThemeJSON } from "./themeTypes";

export async function fetchTheme(): Promise<ThemeJSON> {
  const url = process.env.NEXT_PUBLIC_THEME_URL!;
  const res = await fetch(url, {
    cache: "no-store", // ✅ هر بار از CDN دریافت کن، کش نکن
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch theme: ${res.status}`);
  }

  const json = (await res.json()) as ThemeJSON;
  return json;
}
