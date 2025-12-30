# مستند کامل تغییرات - سیستم Dynamic Card Component

این مستند شامل تمام تغییرات، ایجادات و توضیحات خط به خط از ابتدا تا انتها است.

---

## 📋 فهرست مطالب

1. [خلاصه تغییرات](#خلاصه-تغییرات)
2. [فایل‌های ایجاد شده](#فایل‌های-ایجاد-شده)
3. [فایل‌های تغییر یافته](#فایل‌های-تغییر-یافته)
4. [توضیحات خط به خط](#توضیحات-خط-به-خط)
5. [نحوه کار سیستم](#نحوه-کار-سیستم)

---

## 🎯 خلاصه تغییرات

### هدف اصلی
ایجاد یک کامپوننت Web Component به نام `cti-dynamic-card` که:
- تمام متن‌ها و استایل‌هایش داینامیک باشد
- در حالت dev یک فرم inspector داشته باشد
- تغییرات در فرم به صورت real-time در CDN ذخیره شود
- تغییرات در theme-client بدون نیاز به build اعمال شود

---

## 📁 فایل‌های ایجاد شده

### 1. `wc-react/src/components/CTIDynamicCard.tsx`
**هدف**: کامپوننت React اصلی که UI کارت را رندر می‌کند

### 2. `wc-react/src/entries/cti-dynamic-card.tsx`
**هدف**: Entry point برای Web Component که شامل Dev Inspector و منطق مدیریت config است

---

## 📝 فایل‌های تغییر یافته

### 1. `virtual-cdn/server.js`
### 2. `wc-react/vite.config.ts`
### 3. `wc-react/src/components/index.ts`
### 4. `theme-client/src/components/ClientWrapper.tsx`
### 5. `theme-admin/app/admin/site-preview/page.tsx`
### 6. `theme-client/src/components/Info copy.tsx`

---

## 📄 توضیحات خط به خط

---

## 1️⃣ `wc-react/src/components/CTIDynamicCard.tsx`

این فایل کامپوننت React اصلی را تعریف می‌کند.

```typescript
import React from "react";
```

### Interface تعریف شده:

```typescript
export interface CTIDynamicCardProps {
  title?: string;                    // عنوان اصلی کارت
  subtitle?: string;                 // زیرعنوان
  description?: string;              // توضیحات
  primaryButtonText?: string;        // متن دکمه اصلی
  primaryButtonHref?: string;        // لینک دکمه اصلی
  secondaryButtonText?: string;      // متن دکمه ثانویه
  secondaryButtonHref?: string;      // لینک دکمه ثانویه
  imageUrl?: string;                 // آدرس تصویر
  imageAlt?: string;                 // متن جایگزین تصویر
  badge?: string;                    // متن badge (مثل "New")
  styles?: {                         // استایل‌های داینامیک
    container?: React.CSSProperties;
    card?: React.CSSProperties;
    image?: React.CSSProperties;
    badge?: React.CSSProperties;
    title?: React.CSSProperties;
    subtitle?: React.CSSProperties;
    description?: React.CSSProperties;
    buttonsContainer?: React.CSSProperties;
    primaryButton?: React.CSSProperties;
    secondaryButton?: React.CSSProperties;
  };
}
```

### کامپوننت اصلی:

```typescript
export const CTIDynamicCard: React.FC<CTIDynamicCardProps> = ({
  title = "Dynamic Card",
  subtitle = "",
  description = "This is a fully dynamic card component...",
  // ... سایر props با مقادیر پیش‌فرض
}) => {
```

**خطوط 23-204**: ساختار JSX کامپوننت
- یک `<style>` tag برای استایل‌های پایه
- ساختار HTML کارت شامل:
  - Badge (اگر وجود داشته باشد)
  - تصویر (اگر URL داده شده باشد)
  - محتوای متنی (title, subtitle, description)
  - دکمه‌ها (primary و secondary)

**نکته مهم**: تمام استایل‌ها از طریق prop `styles` قابل تغییر هستند و به صورت inline اعمال می‌شوند.

---

## 2️⃣ `wc-react/src/entries/cti-dynamic-card.tsx`

این فایل پیچیده‌ترین بخش است و شامل:
1. تعریف Type Config
2. توابع helper
3. کامپوننت DevInspector
4. کامپوننت DynamicCardWithInspector
5. کلاس Web Component

### بخش 1: Type Definition (خطوط 5-25)

```typescript
type Config = {
  title?: string;
  subtitle?: string;
  // ... تمام فیلدهای مشابه CTIDynamicCardProps
  styles?: {
    // ... استایل‌ها
  };
};
```

این type دقیقاً مشابه `CTIDynamicCardProps` است و برای مدیریت config استفاده می‌شود.

### بخش 2: Helper Functions

#### `isInspectorEnabled` (خطوط 18-28)

```typescript
function isInspectorEnabled(hostEl: HTMLElement) {
  // 1) بررسی attribute روی element
  const attr = hostEl.getAttribute("data-inspector");
  if (attr === "1" || attr === "true") return true;

  // 2) بررسی global flag
  const g: any = globalThis as any;
  if (g && g.__CTI_WC_DEV__ === true) return true;

  return false;
}
```

**هدف**: بررسی می‌کند که آیا inspector باید نمایش داده شود یا نه.

**روش‌های فعال‌سازی**:
1. `data-inspector="1"` روی element
2. `window.__CTI_WC_DEV__ = true` در global scope

#### `safeParseConfig` (خطوط 30-38)

```typescript
function safeParseConfig(raw: string | null): Config {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
```

**هدف**: پارس کردن JSON از attribute `data-config` به صورت امن.

**مزایا**:
- اگر JSON نامعتبر باشد، object خالی برمی‌گرداند
- از crash جلوگیری می‌کند

#### `safeStringifyConfig` (خطوط 40-46)

```typescript
function safeStringifyConfig(cfg: Config) {
  try {
    return JSON.stringify(cfg);
  } catch {
    return "{}";
  }
}
```

**هدف**: تبدیل Config object به JSON string به صورت امن.

### بخش 3: DevInspector Component (خطوط 48-499)

این کامپوننت فرم dev را نمایش می‌دهد.

#### State Management (خطوط 55-58)

```typescript
const inspectorRef = useRef<HTMLDivElement>(null);
const [pos, setPos] = useState({ x: 10, y: 10 });
const [dragging, setDragging] = useState(false);
const dragOffset = useRef({ x: 0, y: 0 });
```

**هدف**: مدیریت موقعیت و drag & drop فرم.

#### Drag & Drop Logic (خطوط 60-86)

```typescript
const onDragMouseDown = (e: React.MouseEvent) => {
  e.stopPropagation();
  setDragging(true);
  const rect = inspectorRef.current!.getBoundingClientRect();
  dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  e.preventDefault();
};
```

**هدف**: شروع drag operation.

```typescript
const onMouseMove = (e: MouseEvent) => {
  if (!dragging) return;
  setPos({
    x: e.clientX - dragOffset.current.x,
    y: e.clientY - dragOffset.current.y,
  });
};
```

**هدف**: به‌روزرسانی موقعیت فرم هنگام drag.

#### JSX Structure (خطوط 88-499)

**خطوط 88-127**: استایل‌های CSS برای فرم inspector

**خطوط 129-143**: Header فرم با دکمه Drag

**خطوط 145-308**: بخش Content
- Title input
- Subtitle input
- Description textarea
- Badge و Image URL (در یک row2)
- Image Alt Text

**خطوط 310-383**: بخش Buttons
- Primary Button Text و Href
- Secondary Button Text و Href

**خطوط 385-473**: بخش Styles
- Card Background
- Title Color
- Subtitle Color
- Description Color
- Primary Button Background و Text Color
- Secondary Button Background و Text Color

**خطوط 475-499**: دکمه Reset برای بازگشت به مقادیر پیش‌فرض

#### Helper Function: `updateStyle` (خطوط 185-197)

```typescript
const updateStyle = (
  section: keyof NonNullable<Config["styles"]>,
  property: string,
  val: string
) => {
  onChange({
    ...value,
    styles: {
      ...value.styles,
      [section]: {
        ...value.styles?.[section],
        [property]: val,
      },
    },
  });
};
```

**هدف**: به‌روزرسانی یک property خاص در styles object.

### بخش 4: DynamicCardWithInspector Component (خطوط 501-630)

این کامپوننت wrapper اصلی است که:
1. کامپوننت کارت را رندر می‌کند
2. Dev Inspector را مدیریت می‌کند
3. تغییرات config را به CDN ارسال می‌کند

#### State Management (خطوط 508-516)

```typescript
const [config, setConfig] = useState<Config>(initialConfig);
const configRef = useRef<Config>(initialConfig);

// Keep ref in sync with state
useEffect(() => {
  configRef.current = config;
}, [config]);
```

**هدف**: 
- `config`: state اصلی
- `configRef`: ref برای استفاده در event listeners (جلوگیری از stale closure)

#### External Config Change Listener (خطوط 510-548)

```typescript
useEffect(() => {
  const handleConfigChange = (e: CustomEvent) => {
    if (e.detail && typeof e.detail === "object") {
      const newConfig = e.detail as Config;
      const currentConfigStr = JSON.stringify(configRef.current);
      const newConfigStr = JSON.stringify(newConfig);
      if (currentConfigStr !== newConfigStr) {
        setConfig(newConfig);
      }
    }
  };

  const handleAttributeChange = () => {
    const newConfig = safeParseConfig(hostEl.getAttribute("data-config"));
    const currentConfigStr = JSON.stringify(configRef.current);
    const newConfigStr = JSON.stringify(newConfig);
    if (currentConfigStr !== newConfigStr) {
      setConfig(newConfig);
    }
  };

  hostEl.addEventListener("cti:config-change", handleConfigChange as EventListener);
  
  const observer = new MutationObserver(() => {
    handleAttributeChange();
  });

  observer.observe(hostEl, {
    attributes: true,
    attributeFilter: ["data-config"],
  });

  return () => {
    hostEl.removeEventListener("cti:config-change", handleConfigChange as EventListener);
    observer.disconnect();
  };
}, [hostEl]);
```

**هدف**: گوش دادن به تغییرات خارجی config

**دو روش**:
1. **Custom Event**: `cti:config-change` event
2. **MutationObserver**: تغییرات attribute `data-config`

**چرا configRef استفاده شد؟**
- برای جلوگیری از dependency در useEffect
- جلوگیری از infinite loop
- دسترسی به آخرین مقدار config در event handlers

#### Computed Values (خطوط 550-565)

```typescript
const computed = useMemo(() => {
  return {
    title: config.title ?? "Dynamic Card",
    subtitle: config.subtitle ?? "",
    // ... سایر فیلدها با مقادیر پیش‌فرض
  };
}, [config]);
```

**هدف**: محاسبه مقادیر نهایی با fallback به مقادیر پیش‌فرض.

#### Inspector Flag Detection (خطوط 567-586)

```typescript
const [showInspectorFlag, setShowInspectorFlag] = useState(() =>
  isInspectorEnabled(hostEl)
);

useEffect(() => {
  if (showInspectorFlag) return;

  let tries = 0;
  const id = window.setInterval(() => {
    tries += 1;
    if (isInspectorEnabled(hostEl)) {
      setShowInspectorFlag(true);
      window.clearInterval(id);
    } else if (tries >= 20) {
      window.clearInterval(id);
    }
  }, 250);

  return () => window.clearInterval(id);
}, [showInspectorFlag, hostEl]);
```

**هدف**: بررسی دوره‌ای (polling) برای فعال شدن inspector.

**منطق**:
- اگر از ابتدا فعال نبود، هر 250ms بررسی می‌کند
- حداکثر 20 بار تلاش می‌کند (5 ثانیه)
- اگر فعال شد، polling متوقف می‌شود

#### Inspector Open State (خطوط 588-593)

```typescript
const [inspectorOpen, setInspectorOpen] = useState(false);

useEffect(() => {
  if (showInspectorFlag) setInspectorOpen(true);
}, [showInspectorFlag]);
```

**هدف**: باز کردن خودکار inspector وقتی flag فعال می‌شود.

#### Update Config Function (خطوط 595-630)

```typescript
const updateConfig = async (next: Config) => {
  setConfig(next);

  if (showInspectorFlag) {
    hostEl.setAttribute("data-config", safeStringifyConfig(next));
    hostEl.dispatchEvent(
      new CustomEvent("cti:config-change", { detail: next, bubbles: true })
    );

    // ارسال تغییرات به CDN
    try {
      const cdnUrl =
        (globalThis as any).__CTI_CDN_URL__ || "http://localhost:4000";
      const componentId = hostEl.tagName.toLowerCase();

      await fetch(`${cdnUrl}/config/components/${componentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: next }),
      });

      // ارسال پیام به parent window (برای site-preview)
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "configChanged",
            payload: { componentId, config: next },
          },
          "*"
        );
      }
    } catch (err) {
      console.warn("Failed to save config to CDN:", err);
    }
  }
};
```

**هدف**: به‌روزرسانی config و ارسال به CDN

**مراحل**:
1. به‌روزرسانی state
2. به‌روزرسانی attribute `data-config`
3. ارسال custom event
4. ارسال به CDN (POST request)
5. ارسال پیام به parent window (اگر در iframe باشد)

#### Render (خطوط 632-660)

```typescript
return (
  <div className="cti-dynamic-card-host">
    <style>{/* استایل‌های host */}</style>
    <CTIDynamicCard {...computed} styles={config.styles} />
    {showInspectorFlag && (
      <>
        <button onClick={() => setInspectorOpen((v) => !v)}>
          {inspectorOpen ? "Close Inspector" : "Open Inspector"}
        </button>
        {inspectorOpen && (
          <DevInspector value={config} onChange={updateConfig} />
        )}
      </>
    )}
  </div>
);
```

**هدف**: رندر کردن کارت و inspector

### بخش 5: Web Component Class (خطوط 662-721)

```typescript
class CTIDynamicCardElement extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null;

  static get observedAttributes() {
    return ["data-config"];
  }

  connectedCallback() {
    const container = document.createElement("div");
    this.appendChild(container);

    const initialConfig = safeParseConfig(this.getAttribute("data-config"));

    const root = createRoot(container);
    this.root = root;

    root.render(
      <DynamicCardWithInspector hostEl={this} initialConfig={initialConfig} />
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === "data-config" && this.root) {
      const newConfig = safeParseConfig(newValue);
      this.root.render(
        <DynamicCardWithInspector hostEl={this} initialConfig={newConfig} />
      );
    }
  }
}

customElements.define("cti-dynamic-card", CTIDynamicCardElement);
```

**توضیحات**:

1. **observedAttributes**: لیست attributeهایی که باید watch شوند
2. **connectedCallback**: وقتی element به DOM اضافه می‌شود
   - یک container div می‌سازد
   - config اولیه را می‌خواند
   - React root می‌سازد و render می‌کند
3. **disconnectedCallback**: وقتی element از DOM حذف می‌شود
   - React root را unmount می‌کند
4. **attributeChangedCallback**: وقتی `data-config` تغییر می‌کند
   - config جدید را parse می‌کند
   - دوباره render می‌کند

---

## 3️⃣ `virtual-cdn/server.js`

### تغییرات: اضافه شدن Endpoints برای Config

#### GET `/config/components/:id` (خطوط 398-410)

```javascript
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
```

**هدف**: خواندن config یک کامپوننت از cache

**منطق**:
- فایل را از cache می‌خواند
- اگر وجود نداشت، object خالی برمی‌گرداند
- Cache-Control: no-store برای real-time updates

#### POST `/config/components/:id` (خطوط 412-427)

```javascript
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
```

**هدف**: ذخیره config یک کامپوننت در cache

**منطق**:
- body را به صورت JSON در فایل ذخیره می‌کند
- مسیر فایل: `cache/config_components_{id}.json`
- خطاها را handle می‌کند

---

## 4️⃣ `wc-react/vite.config.ts`

### تغییرات: اضافه شدن Entry Point

```typescript
entry: {
  "cti-dynamic-card": resolve(__dirname, "src/entries/cti-dynamic-card.tsx"),
},
```

**هدف**: اضافه کردن entry point برای build

**نتیجه**: بعد از build، فایل `cti-dynamic-card.js` در `virtual-cdn/public/wc/` ایجاد می‌شود

---

## 5️⃣ `wc-react/src/components/index.ts`

### تغییرات: Export کردن کامپوننت

```typescript
export { CTIDynamicCard } from "./CTIDynamicCard";
export type { CTIDynamicCardProps } from "./CTIDynamicCard";
```

**هدف**: امکان import از index

---

## 6️⃣ `theme-client/src/components/ClientWrapper.tsx`

### تغییرات: اضافه شدن Message Handler برای setConfig

```typescript
if (data.type === "setConfig") {
  const config = data.payload?.config ?? data.payload;
  const targets = resolveTargets(data.payload?.componentId);
  if (targets.length === 0 || !config) return;

  targets.forEach((target) => {
    target.setAttribute("data-config", JSON.stringify(config));
    // Trigger custom event to notify component
    target.dispatchEvent(
      new CustomEvent("cti:config-change", {
        detail: config,
        bubbles: true,
      })
    );
  });
}
```

**هدف**: دریافت config از site-preview و اعمال روی کامپوننت

**منطق**:
1. تمام کامپوننت‌های matching را پیدا می‌کند
2. attribute `data-config` را set می‌کند
3. custom event `cti:config-change` را trigger می‌کند
4. کامپوننت Web Component این event را می‌شنود و به‌روز می‌شود

---

## 7️⃣ `theme-admin/app/admin/site-preview/page.tsx`

### تغییرات: مدیریت Config در Site Preview

#### State جدید (خط 45)

```typescript
const [componentConfig, setComponentConfig] = useState<Record<string, any>>({});
```

**هدف**: نگه‌داری config کامپوننت انتخاب شده

#### Load Config on Component Selection (خطوط 57-71)

```typescript
// Load config from CDN
const loadConfig = async () => {
  try {
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
    const res = await fetch(`${cdnUrl}/config/components/${nextId}`, {
      cache: "no-store",
    });
    const data = await res.json();
    setComponentConfig(data?.config || {});
  } catch (err) {
    console.error("Failed to load config:", err);
    setComponentConfig({});
  }
};
loadConfig();
```

**هدف**: وقتی کامپوننتی انتخاب می‌شود، config آن را از CDN می‌خواند

#### Send Config to Iframe (خطوط 137-150)

```typescript
// Send config to iframe when it changes
useEffect(() => {
  if (!iframeLoaded || !selectedComponentId || Object.keys(componentConfig).length === 0) return;
  const targetWindow = iframeRef.current?.contentWindow;
  if (!targetWindow) return;
  targetWindow.postMessage(
    {
      type: "setConfig",
      payload: { componentId: selectedComponentId, config: componentConfig },
    },
    clientOrigin
  );
}, [componentConfig, iframeLoaded, selectedComponentId, clientOrigin]);
```

**هدف**: ارسال config به iframe وقتی تغییر می‌کند

**منطق**:
- منتظر می‌ماند تا iframe load شود
- منتظر می‌ماند تا کامپوننتی انتخاب شود
- منتظر می‌ماند تا config خالی نباشد
- پیام `setConfig` را به iframe ارسال می‌کند

#### Listen for Config Changes from Iframe (خطوط 152-170)

```typescript
// Listen for config changes from iframe (from dev inspector)
useEffect(() => {
  if (!iframeLoaded) return;
  
  const handleConfigChange = (event: MessageEvent) => {
    if (event.origin !== clientOrigin) return;
    const data = event.data || {};
    if (data.type === "configChanged") {
      const { componentId, config } = data.payload || {};
      if (componentId === selectedComponentId && config) {
        setComponentConfig(config);
      }
    }
  };
  
  window.addEventListener("message", handleConfigChange);
  return () => window.removeEventListener("message", handleConfigChange);
}, [iframeLoaded, selectedComponentId, clientOrigin]);
```

**هدف**: گوش دادن به تغییرات config از iframe

**منطق**:
- وقتی dev inspector در iframe config را تغییر می‌دهد
- پیام `configChanged` به parent ارسال می‌شود
- این handler آن را دریافت می‌کند و state را به‌روز می‌کند
- این باعث می‌شود useEffect قبلی trigger شود و config جدید به iframe ارسال شود

---

## 8️⃣ `theme-client/src/components/Info copy.tsx`

### تغییرات: بارگذاری و Polling Config از CDN

#### Load Bundle (خطوط 23-52)

```typescript
useEffect(() => {
  let cancelled = false;

  async function loadBundle() {
    try {
      const bundle = `${
        process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000"
      }/wc/cti-dynamic-card.js`;
      if (bundle) {
        if (!cancelled) loadOnce(bundle);
        return;
      }
      // ... fallback
    } catch {
      // ... fallback
    }
  }

  loadBundle();
  return () => {
    cancelled = true;
  };
}, []);
```

**هدف**: بارگذاری bundle Web Component از CDN

**منطق**:
- یک script tag ایجاد می‌کند و به DOM اضافه می‌کند
- از duplicate loading جلوگیری می‌کند

#### Load and Poll Config (خطوط 54-105)

```typescript
// Load config from CDN and poll for changes
useEffect(() => {
  if (!ref.current) return;

  let lastConfigHash = "";

  const loadConfig = async () => {
    try {
      const cdnUrl =
        process.env.NEXT_PUBLIC_CDN_URL || "http://localhost:4000";
      const res = await fetch(
        `${cdnUrl}/config/components/cti-dynamic-card`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();
      const config = data?.config || {};

      const configStr = JSON.stringify(config);
      const configHash = configStr;

      // Only update if config actually changed
      if (configHash !== lastConfigHash && ref.current) {
        lastConfigHash = configHash;
        if (Object.keys(config).length > 0) {
          ref.current.setAttribute("data-config", configStr);
          // Trigger config change event
          ref.current.dispatchEvent(
            new CustomEvent("cti:config-change", {
              detail: config,
              bubbles: true,
            })
          );
        }
      }
    } catch (err) {
      console.warn("Failed to load config from CDN:", err);
    }
  };

  // Initial load
  const timeout = setTimeout(loadConfig, 100);

  // Poll for changes every 2 seconds (only in dev/admin preview mode)
  const isDev =
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" &&
      new URL(window.location.href).searchParams.get("adminPreview") === "1");

  let pollInterval: NodeJS.Timeout | null = null;
  if (isDev) {
    pollInterval = setInterval(loadConfig, 2000);
  }

  return () => {
    clearTimeout(timeout);
    if (pollInterval) clearInterval(pollInterval);
  };
}, []);
```

**هدف**: بارگذاری اولیه و polling برای تغییرات config

**منطق**:

1. **Initial Load**: بعد از 100ms config را می‌خواند (برای اطمینان از mount شدن element)

2. **Polling**: 
   - فقط در dev mode یا admin preview
   - هر 2 ثانیه یک بار config را می‌خواند
   - با hash مقایسه می‌کند تا فقط در صورت تغییر به‌روزرسانی کند

3. **Update**:
   - attribute `data-config` را set می‌کند
   - custom event `cti:config-change` را trigger می‌کند
   - Web Component این event را می‌شنود و به‌روز می‌شود

**چرا Polling؟**
- برای real-time updates بدون نیاز به WebSocket
- فقط در dev mode فعال است (performance)
- با hash comparison از unnecessary updates جلوگیری می‌کند

#### Render (خطوط 107-115)

```typescript
const element = `cti-dynamic-card`;

const isDev = process.env.NODE_ENV === "development";
const isAdminPreview =
  typeof window !== "undefined" &&
  new URL(window.location.href).searchParams.get("adminPreview") === "1";

return React.createElement(element, {
  ref,
  ...(isDev || isAdminPreview ? { "data-inspector": "1" } : {}),
});
```

**هدف**: رندر کردن Web Component

**منطق**:
- در dev mode یا admin preview، `data-inspector="1"` را set می‌کند
- این باعث فعال شدن Dev Inspector می‌شود

---

## 🔄 نحوه کار سیستم (Flow)

### سناریو 1: تغییر در Dev Inspector

```
1. کاربر در /admin/site-preview کامپوننت را انتخاب می‌کند
   ↓
2. Dev Inspector باز می‌شود
   ↓
3. کاربر در فرم تغییراتی ایجاد می‌کند
   ↓
4. updateConfig() فراخوانی می‌شود
   ↓
5. Config به CDN ارسال می‌شود (POST /config/components/cti-dynamic-card)
   ↓
6. پیام configChanged به parent window ارسال می‌شود
   ↓
7. site-preview این پیام را دریافت می‌کند و state را به‌روز می‌کند
   ↓
8. useEffect trigger می‌شود و config جدید به iframe ارسال می‌شود
   ↓
9. ClientWrapper پیام setConfig را دریافت می‌کند
   ↓
10. attribute data-config را set می‌کند و event trigger می‌کند
   ↓
11. Web Component event را می‌شنود و به‌روز می‌شود
```

### سناریو 2: بارگذاری در Theme Client

```
1. کامپوننت DinamicCard mount می‌شود
   ↓
2. Bundle از CDN بارگذاری می‌شود
   ↓
3. بعد از 100ms config از CDN خوانده می‌شود
   ↓
4. attribute data-config set می‌شود
   ↓
5. Web Component config را می‌خواند و render می‌کند
   ↓
6. Polling شروع می‌شود (هر 2 ثانیه)
   ↓
7. اگر config تغییر کرد:
   - attribute به‌روز می‌شود
   - event trigger می‌شود
   - Web Component به‌روز می‌شود
```

### سناریو 3: تغییر از Admin Panel

```
1. Admin config را در CDN ذخیره می‌کند
   ↓
2. Theme Client polling می‌کند (هر 2 ثانیه)
   ↓
3. تغییر را detect می‌کند
   ↓
4. Config را اعمال می‌کند
```

---

## 🎯 نکات مهم

### 1. چرا از useRef استفاده شد؟
- جلوگیری از stale closure در event listeners
- جلوگیری از infinite loop در useEffect

### 2. چرا Polling؟
- ساده‌تر از WebSocket
- فقط در dev mode فعال است
- با hash comparison بهینه شده

### 3. چرا MutationObserver؟
- برای detect کردن تغییرات attribute از خارج
- Real-time updates بدون polling

### 4. چرا Custom Events؟
- Decoupling بین کامپوننت‌ها
- امکان listen کردن از هر جایی

### 5. چرا Cache-Control: no-store؟
- برای real-time updates
- جلوگیری از cache شدن config

---

## 📊 ساختار فایل‌ها

```
wc-react/
├── src/
│   ├── components/
│   │   ├── CTIDynamicCard.tsx          (کامپوننت React)
│   │   └── index.ts                    (exports)
│   └── entries/
│       └── cti-dynamic-card.tsx         (Web Component + Inspector)
├── vite.config.ts                      (build config)
└── package.json

virtual-cdn/
├── server.js                           (CDN server + endpoints)
└── cache/
    └── config_components_*.json        (ذخیره config ها)

theme-admin/
└── app/
    └── admin/
        └── site-preview/
            └── page.tsx                (مدیریت config در admin)

theme-client/
└── src/
    ├── components/
    │   ├── ClientWrapper.tsx           (message handlers)
    │   └── Info copy.tsx               (DinamicCard component)
    └── app/
        └── page.tsx                    (استفاده از DinamicCard)
```

---

## ✅ خلاصه

1. **کامپوننت React** برای UI
2. **Web Component** برای encapsulation
3. **Dev Inspector** برای editing در dev mode
4. **CDN Endpoints** برای ذخیره/خواندن config
5. **Message Passing** برای ارتباط بین admin و client
6. **Polling** برای real-time updates
7. **Event System** برای reactivity

تمام این‌ها با هم یک سیستم کامل برای مدیریت داینامیک کامپوننت‌ها ایجاد می‌کنند که بدون نیاز به build مجدد کار می‌کند.

