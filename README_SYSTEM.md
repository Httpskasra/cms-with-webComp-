# Component Catalog & Style Editor System

Complete admin-only interface for managing Web Components, design tokens, and
theme versioning with automatic cache busting.

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│  ADMIN INTERFACE (theme-admin)                              │
│  ✅ Component Catalog & Editor                              │
│  ✅ Live Preview (iframe-based)                             │
│  ✅ Token/CSS Variable Editor                               │
│  ✅ Version History & Rollback                              │
│  ✅ Audit Logging                                           │
│  ✅ Admin Documentation (docs never sent to client)         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ POST /api/admin/theme/generate
                   │ (version, hash, audit log)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  VIRTUAL CDN (virtual-cdn/server.js)                        │
│  ✅ Manifest endpoints (public & admin)                     │
│  ✅ Versioned theme cache                                   │
│  ✅ Cache invalidation                                      │
│  ✅ Immutable versioned assets                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ GET /cdn/api/theme/dev/theme_dev_v*.css
                   │ GET /manifest/public (docs-free)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  CLIENT APPLICATION (theme-client)                          │
│  ✅ Safe type system (no admin types)                       │
│  ✅ Loads manifest.public only                              │
│  ✅ No documentation in build                               │
│  ✅ Cache-busted theme URLs                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 File Structure

### Admin Interface

```
theme-admin/
├── public/
│   ├── manifest.admin.json          # Full manifest with docs
│   └── manifest.public.json         # Client-safe manifest
├── app/
│   ├── admin/
│   │   ├── components/              # Component catalog
│   │   │   ├── page.tsx            # List all components
│   │   │   └── [name]/
│   │   │       └── page.tsx        # Editor with 5 tabs
│   │   └── preview/[component]/
│   │       └── page.tsx            # Iframe-based preview
│   └── api/admin/
│       └── theme/
│           ├── generate/route.ts   # Publish theme
│           ├── versions/route.ts   # Version history
│           └── rollback/route.ts   # Rollback to version
├── src/
│   ├── lib/
│   │   ├── manifestClient.ts       # Fetch manifests
│   │   └── themeVersioning.ts      # Version generation
│   └── components/admin/
│       ├── ComponentPreview.tsx    # Live preview
│       ├── TokenEditor.tsx         # Token editor
│       ├── ComponentDocs.tsx       # Admin docs
│       └── PublishTheme.tsx        # Publish button
└── ADMIN_GUIDE.md                  # Detailed guide
```

### Client Interface

```
theme-client/
├── src/
│   ├── lib/
│   │   ├── manifestClient.ts       # Fetch public manifest only
│   │   ├── theme.ts               # Theme utilities
│   │   └── themeTypes.ts          # Client-safe types (no docs)
│   └── components/                 # Your app components
```

### Virtual CDN

```
virtual-cdn/
├── server.js                       # Updated with new endpoints
├── cache/
│   ├── manifest.admin.json         # Admin-only manifest
│   ├── manifest.public.json        # Client-safe manifest
│   └── theme_dev_v*.css            # Versioned theme files
└── public/
    └── wc/                         # Web component bundles
```

---

## 🚀 Getting Started

### 1. Start Virtual CDN

```bash
cd virtual-cdn
npm install
npm start
# Server runs on http://localhost:4000
```

### 2. Start Admin Interface

```bash
cd theme-admin
npm install
npm run dev
# Admin runs on http://localhost:3001
# Navigate to http://localhost:3001/admin/components
```

### 3. Copy Manifests to CDN

Before first use, copy manifest files to CDN cache:

```bash
# From virtual-cdn folder
cp ../theme-admin/public/manifest.admin.json cache/
cp ../theme-admin/public/manifest.public.json cache/
```

### 4. Start Client Application

```bash
cd theme-client
npm install
npm run dev
# Client runs on http://localhost:3000
```

---

## 📋 Core Features

### 1. Component Manifest (Registry)

**Admin Manifest** (`manifest.admin.json`) - Contains full component definitions
with docs:

```json
{
  "registry": [
    {
      "id": "cti-footer",
      "name": "CTI Footer",
      "bundle": "http://localhost:4000/cdn/wc/cti-footer.js",
      "props": [...],
      "cssVars": [...],
      "docs": {
        "adminOnly": true,
        "overview": "...",
        "examples": [...]
      }
    }
  ],
  "designTokens": {
    "colors": {...},
    "spacing": {...},
    "radius": {...}
  }
}
```

**Public Manifest** (`manifest.public.json`) - Docs stripped, safe for client:

```json
{
  "registry": [
    {
      "id": "cti-footer",
      "name": "CTI Footer",
      "bundle": "...",
      "props": [...],
      "cssVars": [...]
      // ❌ NO docs field
    }
  ]
}
```

### 2. Component Preview (iframe)

- **Route**: `/admin/preview/[component]`
- **Isolated**: Runs in sandbox iframe
- **Safe**: CSS doesn't leak to admin page
- **Dynamic**: Communicates via postMessage

**How it works:**

1. Admin page loads component editor
2. Embedded iframe at `/admin/preview/[componentId]`
3. Parent → Child: `postMessage({type: "setProps", payload})`
4. Child: `postMessage({type: "computedStyles", payload})`
5. Real-time preview updates

### 3. Token/CSS Variable Editor

Edit design tokens with:

- **Color tokens**: Color picker + hex input
- **Dimension tokens**: Text input with units
- **Custom tokens**: Free-form text
- **Live preview**: Changes reflected immediately

### 4. Versioning System

Every publish creates:

```
Version ID: v20251224_143022_3f91c2
├── Timestamp: 20251224_143022 (YYYYMMDDhhmmss)
├── Hash: 3f91c2 (first 8 chars of SHA256)
└── Usage: theme_dev_v20251224_143022_3f91c2.css
```

### 5. Audit Logging

All changes logged to `theme-admin/logs/theme-audit.jsonl`:

```jsonl
{
  "versionId": "v20251224_143022",
  "timestamp": "2025-12-24T14:30:22Z",
  "author": "admin",
  "action": "PUBLISH",
  "componentId": "cti-footer",
  "tokens": {
    "--color-primary": "#6366f1"
  },
  "env": "dev"
}
```

### 6. Rollback Capability

Restore any previous version:

```
Original: v20251224_143022 (--color-primary: #4f46e5)
Updated:  v20251224_143055 (--color-primary: #6366f1) ❌
Rollback: rollback_20251224_143100 (restored v20251224_143022)
```

---

## 🔐 Admin-Only Data Protection

### What's Protected

| Item            | Admin | Client |
| --------------- | ----- | ------ |
| Component Props | ✅    | ✅     |
| CSS Variables   | ✅    | ✅     |
| Docs/Examples   | ✅    | ❌     |
| Slots/Events    | ✅    | ❌     |
| Audit Log       | ✅    | ❌     |
| Rollback UI     | ✅    | ❌     |
| Version History | ✅    | ❌     |

### Enforcement Mechanisms

1. **Separate Manifests**

   - `manifest.admin.json` - Full data (auth required)
   - `manifest.public.json` - Stripped version (public)

2. **Type System**

   - `theme-admin` uses full types
   - `theme-client` uses client-safe types
   - TypeScript prevents doc usage

3. **API Routes**

   - `/api/admin/*` - Admin authentication required
   - `/manifest/admin` - Protected endpoint
   - `/manifest/public` - Public, docs-free

4. **Build Isolation**
   - Admin and client are separate Next.js apps
   - No shared dependencies with docs
   - Tree-shaking removes unused types

---

## 🔄 Publishing Flow

```
1. Admin edits tokens in UI
   └─→ /admin/components/cti-footer?tab=tokens

2. Previews changes in iframe
   └─→ Live preview updates

3. Clicks "Publish to CDN"
   └─→ POST /api/admin/theme/generate

4. Server generates CSS
   └─→ CSS: root { --color-primary: #6366f1; }

5. Creates version ID
   └─→ v20251224_143022_3f91c2

6. Saves to CDN cache
   └─→ cache/theme_dev_v20251224_143022_3f91c2.css

7. Logs audit trail
   └─→ logs/theme-audit.jsonl

8. Returns version URL
   └─→ http://localhost:4000/cdn/api/theme/dev/theme_dev_v20251224_143022_3f91c2.css

9. Client fetches with version in URL
   └─→ Browser caches indefinitely (immutable)

10. Next version invalidates old cache
    └─→ postMessage /invalidate-cache
```

---

## 📡 API Endpoints

### Theme Generation (Publish)

```bash
POST /api/admin/theme/generate

Body:
{
  "componentId": "cti-footer",
  "tokens": {
    "--color-primary": "#6366f1",
    "--spacing-md": "14px"
  },
  "author": "john@example.com",
  "description": "Brand color update",
  "env": "dev"
}

Response:
{
  "success": true,
  "version": "v20251224_143022_3f91c2",
  "hash": "3f91c2",
  "assetPath": "/api/theme/dev/v20251224_143022_3f91c2/theme_dev.css",
  "cssFile": "theme_dev_v20251224_143022_3f91c2.css",
  "url": "http://localhost:4000/cdn/api/theme/dev/theme_dev_v20251224_143022_3f91c2.css"
}
```

### Version History

```bash
GET /api/admin/theme/versions

Response:
{
  "success": true,
  "total": 15,
  "versions": [
    {
      "versionId": "v20251224_143022",
      "timestamp": "2025-12-24T14:30:22Z",
      "author": "admin",
      "componentId": "cti-footer",
      "description": "Brand color update",
      "env": "dev"
    }
  ]
}
```

### Rollback

```bash
POST /api/admin/theme/rollback

Body:
{
  "versionId": "v20251224_143022",
  "env": "dev"
}

Response:
{
  "success": true,
  "rollbackVersion": "rollback_20251224_143100"
}
```

### CDN - Get Manifest (Public)

```bash
GET http://localhost:4000/manifest/public
# Returns: manifest.public.json (docs excluded)
```

### CDN - Get Manifest (Admin)

```bash
GET http://localhost:4000/manifest/admin
# Returns: manifest.admin.json (full, with docs)
# ⚠️ Requires auth in production
```

### CDN - Serve Versioned Theme

```bash
GET http://localhost:4000/cdn/api/theme/dev/theme_dev_v20251224_143022_3f91c2.css
# Returns: CSS with custom properties
# Cache-Control: public, max-age=31536000, immutable
```

### CDN - Invalidate Cache

```bash
POST http://localhost:4000/invalidate-cache

Body:
{
  "patterns": ["theme_dev_.*", "manifest\\..*"]
}

Response:
{
  "ok": true,
  "deletedCount": 5,
  "message": "Invalidated 5 cache files"
}
```

---

## 📊 Design Tokens Reference

### Colors

```css
--color-primary: #4f46e5;
--color-secondary: #f97316;
--color-success: #22c55e;
--color-warning: #eab308;
--color-error: #ef4444;
--color-background: #ffffff;
--color-foreground: #111827;
--color-border: #e5e7eb;
```

### Spacing

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
```

### Border Radius

```css
--radius-none: 0px;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
--radius-full: 9999px;
```

---

## 🛠️ Environment Variables

### theme-admin (.env.local)

```env
NEXT_PUBLIC_CDN_URL=http://localhost:4000
NEXT_PUBLIC_ENV=dev
NEXT_PUBLIC_THEME_URL=http://localhost:4000/cdn/api/theme.json
```

### theme-client (.env.local)

```env
NEXT_PUBLIC_THEME_URL=http://localhost:4000/cdn/api/theme.json
NEXT_PUBLIC_CDN_URL=http://localhost:4000
NEXT_PUBLIC_MANIFEST_URL=http://localhost:4000/manifest/public
```

---

## 🎯 Best Practices

### For Admin

- ✅ Preview before publish
- ✅ Add descriptive change notes
- ✅ Keep dev/prod environments separate
- ✅ Review audit log regularly
- ✅ Test rollback capability

### For Developers

- ✅ Use design tokens in CSS
- ✅ Never hardcode colors/spacing
- ✅ Import manifest.public only
- ✅ Respect CSS variable scope
- ✅ Don't modify admin types

### For Security

- ✅ Auth protect `/api/admin/*` routes
- ✅ Auth protect `/manifest/admin` endpoint
- ✅ Log all admin actions
- ✅ Rate-limit CDN cache invalidation
- ✅ Audit theme changes weekly

---

## 🔄 Versioning Examples

### Example 1: Simple Token Update

```
Publish 1:
--color-primary: #4f46e5
Version: v20251224_120000_a1b2c3
File: theme_dev_v20251224_120000_a1b2c3.css

Publish 2:
--color-primary: #6366f1  (updated)
Version: v20251224_120530_d4e5f6
File: theme_dev_v20251224_120530_d4e5f6.css

Client URLs:
/cdn/api/theme/dev/theme_dev_v20251224_120000_a1b2c3.css (old - immutable)
/cdn/api/theme/dev/theme_dev_v20251224_120530_d4e5f6.css (new - immutable)
```

### Example 2: Rollback

```
v1: --color-primary: #4f46e5 (good)
v2: --color-primary: #6366f1 (mistake)
Rollback: rollback_20251224_140000_g7h8i9 (restored v1)

Serves:
/cdn/api/theme/dev/theme_dev_rollback_20251224_140000_g7h8i9.css
```

---

## 📈 Monitoring

### Log Location

```
theme-admin/logs/theme-audit.jsonl
```

### Sample Entry

```json
{
  "versionId": "v20251224_143022",
  "timestamp": "2025-12-24T14:30:22.123Z",
  "author": "admin@company.com",
  "action": "PUBLISH",
  "componentId": "cti-footer",
  "description": "Updated primary color for brand refresh",
  "tokens": {
    "--color-primary": "#6366f1",
    "--button-bg": "#6366f1"
  },
  "env": "dev"
}
```

---

## 🚨 Troubleshooting

| Issue                 | Solution                                        |
| --------------------- | ----------------------------------------------- |
| Manifest not loading  | Ensure CDN is running, check `/manifest/public` |
| Preview not updating  | Check iframe `/admin/preview/[component]` URL   |
| Publish fails         | Check `/api/admin/theme/generate` endpoint      |
| Old CSS being served  | Clear CDN cache: `POST /invalidate-cache`       |
| Version not appearing | Check `logs/theme-audit.jsonl` for errors       |

---

## 📞 Support

For detailed admin instructions, see [ADMIN_GUIDE.md](./ADMIN_GUIDE.md).

For API documentation, see endpoint comments in:

- `app/api/admin/theme/generate/route.ts`
- `app/api/admin/theme/versions/route.ts`
- `app/api/admin/theme/rollback/route.ts`
- `virtual-cdn/server.js`

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-24  
**Status**: Production-Ready
