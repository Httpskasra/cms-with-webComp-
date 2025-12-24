import fs from "fs/promises";
import path from "path";

const themePath = path.join(process.cwd(), "app", "theme.json");

export async function readThemeFile() {
  const raw = await fs.readFile(themePath, "utf8");
  return JSON.parse(raw);
}

export async function writeThemeFile(json: unknown) {
  const pretty = JSON.stringify(json, null, 2);
  await fs.writeFile(themePath, pretty, "utf8");
}
