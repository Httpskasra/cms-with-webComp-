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

// ✅ CORS for manifests and theme files
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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

  // Mapping برای فایل‌های خاص
  let originPath = filePath;
  if (filePath === "site.json") {
    originPath = "api/site"; // درخواست از /api/site endpoint
  }

  const originUrl = `${ORIGIN}/${originPath}`; // مثلا http://localhost:3001/api/theme.json

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
  const isDev = process.env.NODE_ENV !== "production";

  // ✅ dev: WC و CSS بدون cache
  if (isDev && (filePath.endsWith(".js") || filePath.endsWith(".css"))) {
    return "no-store";
  }

  // ✅ فایل‌های config که تغییر می‌کنند
  if (
    filePath.endsWith("theme.json") ||
    filePath.endsWith("latest.json") ||
    filePath.endsWith("manifest.json")
  ) {
    return "no-cache, must-revalidate";
  }
  // ✅ فایل‌های versioned (با hash/version ID) → immutable
  if (filePath.includes("_v") || filePath.includes("_")) {
    return "public, max-age=31536000, immutable";
  }
  // ✅ فایل‌های ثابت مثل js/css
  if (filePath.endsWith(".js") || filePath.endsWith(".css")) {
    return "public, max-age=31536000, immutable";
  }
  return "public, max-age=3600";
}

// روت اصلی CDN: همیشه اول از cache می‌خواند
app.get("/cdn/*", async (req, res) => {
  const filePath = req.params[0]; // مثلا "api/theme.json" یا "wc/cti-footer-hover.js"

  // ✅ اگر فایل از web components است → از /wc static route برگردان
  if (filePath.startsWith("wc/")) {
    try {
      const wcFilePath = path.join(process.cwd(), "public", filePath);
      const content = await fs.readFile(wcFilePath);
      res.setHeader("Cache-Control", getCacheControl(filePath));
      res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.send(content);
    } catch (err) {
      console.error("❌ WC File Not Found:", filePath);
      return res.status(404).send("File Not Found");
    }
  }

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

// ✅ Manifest endpoints (public and admin)
app.get("/manifest/public", async (req, res) => {
  const manifestPath = path.join(CACHE_DIR, "manifest.public.json");
  try {
    const content = await fs.readFile(manifestPath, "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.send(content);
  } catch (err) {
    console.error("❌ Manifest not found:", err.message);
    res.status(404).json({ error: "Manifest not found" });
  }
});

app.get("/manifest/admin", async (req, res) => {
  const manifestPath = path.join(CACHE_DIR, "manifest.admin.json");
  try {
    const content = await fs.readFile(manifestPath, "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.send(content);
  } catch (err) {
    console.error("❌ Admin manifest not found:", err.message);
    res.status(404).json({ error: "Admin manifest not found" });
  }
});

// New endpoints: components index and per-component JSON + site info
app.get("/components/index", async (req, res) => {
  const manifestPath = path.join(CACHE_DIR, "manifest.admin.json");
  try {
    const content = await fs.readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(content);

    // Build a lightweight index for admin search (includes admin-only flag and bundle)
    const index = {
      version: manifest.version,
      registry: manifest.registry.map((c) => ({
        id: c.id,
        name: c.name,
        version: c.version,
        description: c.description,
        adminOnly: c.adminOnly || false,
        bundle: c.bundle || null,
        props: c.props || [],
        cssVars: c.cssVars || [],
      })),
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    return res.json(index);
  } catch (err) {
    console.error("❌ Could not build components index:", err.message);
    return res.status(500).json({ error: "Cannot build components index" });
  }
});

app.get("/components/:id", async (req, res) => {
  const { id } = req.params;
  const manifestPath = path.join(CACHE_DIR, "manifest.admin.json");

  try {
    const content = await fs.readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(content);
    const comp = manifest.registry.find((c) => c.id === id);
    if (!comp) return res.status(404).json({ error: "Component not found" });

    // Serve full component information (including docs, cssVars, overrides)
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    return res.json(comp);
  } catch (err) {
    console.error("❌ Error serving component:", err.message);
    return res.status(500).json({ error: "Cannot read component" });
  }
});
app.get("/site", async (req, res) => {
  // Serve site.json directly from cache
  const sitePath = path.join(CACHE_DIR, "site.json");
  try {
    const content = await fs.readFile(sitePath, "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    return res.send(content);
  } catch (err) {
    // Fallback: build from manifest.public.json if site.json doesn't exist
    console.warn("⚠️ site.json not found, building from manifest...");
    const publicPath = path.join(CACHE_DIR, "manifest.public.json");
    try {
      const content = await fs.readFile(publicPath, "utf-8");
      const manifest = JSON.parse(content);

      const site = {
        version: manifest.version,
        designTokens: manifest.designTokens || {},
        components: (manifest.registry || []).reduce((acc, c) => {
          acc[c.id] = {
            id: c.id,
            name: c.name,
            bundle: c.bundle,
            version: c.version,
            description: c.description,
            props: c.props || [],
            cssVars: c.cssVars || [],
          };
          return acc;
        }, {}),
      };

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
      return res.json(site);
    } catch (buildErr) {
      console.error("❌ Could not build site JSON:", buildErr.message);
      return res.status(500).json({ error: "Cannot build site JSON" });
    }
  }
});
app.get("/api/theme/:env/:filename", async (req, res) => {
  const { env, filename } = req.params;
  const themePath = path.join(CACHE_DIR, filename);

  try {
    const content = await fs.readFile(themePath, "utf-8");
    res.setHeader("Content-Type", "text/css; charset=utf-8");
    res.setHeader("Cache-Control", getCacheControl(filename));
    res.send(content);
    console.log(`✅ Served theme: ${filename}`);
  } catch (err) {
    console.error(`❌ Theme file not found: ${filename}`, err.message);
    res.status(404).json({ error: "Theme file not found" });
  }
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

// ✅ Cache invalidation endpoint (for admin)
app.post("/invalidate-cache", async (req, res) => {
  const { patterns } = req.body || {};

  if (!patterns || !Array.isArray(patterns)) {
    return res
      .status(400)
      .json({ ok: false, error: "patterns array required" });
  }

  try {
    await ensureCache();
    const files = await fs.readdir(CACHE_DIR);
    let deletedCount = 0;

    for (const file of files) {
      for (const pattern of patterns) {
        const regex = new RegExp(pattern);
        if (regex.test(file)) {
          await fs.unlink(path.join(CACHE_DIR, file));
          deletedCount++;
          console.log(`🗑️ Invalidated: ${file}`);
        }
      }
    }

    return res.json({
      ok: true,
      message: `Invalidated ${deletedCount} cache files`,
      deletedCount,
    });
  } catch (err) {
    console.error("❌ Cache invalidation error:", err.message);
    return res.status(500).json({
      ok: false,
      error: "Cannot invalidate cache",
      details: err.message,
    });
  }
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 🎨 Override endpoints for development
// Get component overrides (CSS variables)
app.get("/overrides/components/:id", async (req, res) => {
  const id = req.params.id;
  const file = path.join(CACHE_DIR, `overrides_components_${id}.json`);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const content = await fs.readFile(file, "utf-8");
    return res.send(content);
  } catch {
    // اگر override نیست، خالی برگردون
    return res.json({ cssVars: {} });
  }
});

// Save component overrides (CSS variables)
app.post("/overrides/components/:id", async (req, res) => {
  const id = req.params.id;
  const file = path.join(CACHE_DIR, `overrides_components_${id}.json`);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    // body: { cssVars: { "--x": "..." } }
    await ensureCache();
    await fs.writeFile(file, JSON.stringify(req.body || {}, null, 2), "utf-8");

    console.log(`✅ Override saved for component: ${id}`);
    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ Override write failed:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Get component config (data-config for web components)
app.get("/config/components/:id", async (req, res) => {
  const id = req.params.id;
  const file = path.join(CACHE_DIR, `config_components_${id}.json`);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const content = await fs.readFile(file, "utf-8");
    return res.send(content);
  } catch {
    // اگر config نیست، خالی برگردون
    return res.json({ config: {} });
  }
});

// Save component config (data-config for web components)
app.post("/config/components/:id", async (req, res) => {
  const id = req.params.id;
  const file = path.join(CACHE_DIR, `config_components_${id}.json`);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    // body: { config: { title: "...", description: "..." } }
    await ensureCache();
    await fs.writeFile(file, JSON.stringify(req.body || {}, null, 2), "utf-8");

    console.log(`✅ Config saved for component: ${id}`);
    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ Config write failed:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () =>
  console.log(
    `🚀 Virtual CDN running → http://localhost:${PORT}/cdn/\n📋 Manifest (Public) → http://localhost:${PORT}/manifest/public\n🔐 Manifest (Admin) → http://localhost:${PORT}/manifest/admin\n✅ Health → http://localhost:${PORT}/health`
  )
);
