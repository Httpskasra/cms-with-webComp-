import express from "express";
import axios from "axios";
import fs from "fs/promises";
import path from "path";

const app = express();
const PORT = 4000;

// آدرس origin (پنل Next.js تو)
const ORIGIN = "http://localhost:3001"; // اگر پنل روی پورت دیگری است اینجا تغییر بده

// فولدر cache
const CACHE_DIR = path.join(process.cwd(), "cache");

// برای خواندن body JSON
app.use(express.json());
// ✅ CORS for module scripts
app.use("/wc", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // یا دقیق‌تر: "http://localhost:3000"
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(
  "/wc",
  express.static(path.join(process.cwd(), "public", "wc"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Cache-Control", getCacheControl(filePath));
      res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    },
  })
);
// ساخت پوشه cache اگر وجود ندارد
async function ensureCache() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (err) {
    console.error("❌ Cannot create cache dir:", err);
  }
}

// کمک‌کننده: ساختن مسیر فایل cache بر اساس مسیر logical
function getCachePath(filePath) {
  const cleanName = filePath.replace(/\//g, "_"); // مثلا "api/theme.json" -> "api_theme.json"
  return path.join(CACHE_DIR, cleanName);
}

// کمک‌کننده: گرفتن فایل از origin و ذخیره در cache (برای refresh)
async function refreshCacheFile(filePath) {
  const cachePath = getCachePath(filePath);
  const originUrl = `${ORIGIN}/${filePath}`; // مثلا http://localhost:3001/api/theme.json

  console.log("♻️ Refresh from origin →", originUrl);

  const response = await axios.get(originUrl, {
    responseType: "arraybuffer",
  });

  await fs.writeFile(cachePath, response.data);

  return cachePath;
}

const getContentType = (filePath) => {
  if (filePath.endsWith(".json")) return "application/json";
  if (filePath.endsWith(".css")) return "text/css";
  if (filePath.endsWith(".js")) return "application/javascript";
  return "application/octet-stream";
};
function getCacheControl(filePath) {
  // ✅ فایل‌های config که تغییر می‌کنند
  if (filePath.endsWith("theme.json") || filePath.endsWith("latest.json")) {
    return "no-cache";
  }
  // ✅ فایل‌های ثابت مثل js/css
  if (filePath.endsWith(".js") || filePath.endsWith(".css")) {
    return "public, max-age=31536000, immutable";
  }
  return "public, max-age=3600";
}
// روت اصلی CDN: همیشه اول از cache می‌خواند
app.get("/cdn/*", async (req, res) => {
  const filePath = req.params[0]; // مثلا "api/theme.json" یا "file.css"

  await ensureCache();

  const cachePath = getCachePath(filePath);

  // 1) اگر در cache هست → همان را برگردان
  try {
    const cached = await fs.readFile(cachePath);
    console.log("⚡ From Cache →", filePath);

    res.setHeader("Cache-Control", getCacheControl(filePath));
    res.setHeader("Content-Type", getContentType(filePath));
    return res.send(cached);
  } catch {
    // continue → cache miss
  }

  // 2) اگر در cache نیست → از origin بگیر، ذخیره کن، بعد برگردان
  try {
    const originUrl = `${ORIGIN}/${filePath}`;
    console.log("🌐 Fetch from Origin →", originUrl);

    const response = await axios.get(originUrl, {
      responseType: "arraybuffer",
    });

    await fs.writeFile(cachePath, response.data);

    res.setHeader("Cache-Control", getCacheControl(filePath));
    res.setHeader("Content-Type", getContentType(filePath));
    res.send(response.data);
  } catch (err) {
    console.error("❌ Origin Fetch Error:", err.message);
    res.status(404).send("File Not Found");
  }
});

// روت Registry: لیست تمام web components
app.get("/registry/web-components.json", (req, res) => {
  res.json([
    {
      name: "cti-footer",
      version: "1.0.0",
      cachedVersion: "1.0.0",
      docs: "بخش footer",
    },
  ]);
});

// روت جدید: Admin بعد از تغییر theme.json این را صدا می‌زند
// بدنهٔ درخواست: { "filePath": "api/theme.json" }
app.post("/refresh-cache", async (req, res) => {
  const { filePath } = req.body || {};

  if (!filePath || typeof filePath !== "string") {
    return res.status(400).json({ ok: false, error: "filePath لازم است" });
  }

  try {
    await ensureCache();
    const cachePath = await refreshCacheFile(filePath);
    console.log("✅ Cache refreshed for:", filePath);
    return res.json({ ok: true, filePath, cachePath });
  } catch (err) {
    console.error("❌ Refresh cache error:", err.message);
    return res
      .status(500)
      .json({ ok: false, error: "Cannot refresh cache", details: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Virtual CDN running → http://localhost:${PORT}/cdn/`)
);
// حالا می‌توانی فایل‌ها را از طریق آدرس‌هایی مثل این بگیری:
// http://localhost:4000/cdn/api/theme.json
// http://localhost:4000/cdn/styles/global.css
