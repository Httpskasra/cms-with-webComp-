# 🚀 Quick Reference Guide

## Starting Services

```bash
# Terminal 1: CDN
cd virtual-cdn && npm start

# Terminal 2: Admin
cd theme-admin && npm run dev

# Terminal 3: Client
cd theme-client && npm run dev
```

**URLs:**

- Admin: http://localhost:3001/admin/components
- Client: http://localhost:3000
- CDN: http://localhost:4000/health

---

## Admin Workflow

### 1. Open Component Editor

```
http://localhost:3001/admin/components
→ Click any component
```

### 2. Edit Design Tokens

```
Click "Tokens" tab
→ Edit color / dimension / custom values
→ Live preview updates
```

### 3. Publish Changes

```
Click "Publish to CDN" button
→ See version ID: v20251224_143022_3f91c2
→ CSS file saved to CDN cache
```

### 4. View History

```
GET /api/admin/theme/versions
→ See all published versions with timestamps
```

### 5. Rollback If Needed

```
POST /api/admin/theme/rollback
{"versionId": "v20251224_143022", "env": "dev"}
→ Previous version restored
```

---

## Available Tokens

```css
/* Colors */
--color-primary: #4f46e5;
--color-secondary: #f97316;
--color-success: #22c55e;
--color-error: #ef4444;
--color-background: #ffffff;
--color-foreground: #111827;
--color-border: #e5e7eb;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
--radius-full: 9999px;
```

---

## API Endpoints

### Generate / Publish Theme

```
POST /api/admin/theme/generate
Body: {
  "componentId": "cti-footer",
  "tokens": {"--color-primary": "#6366f1"},
  "env": "dev"
}
Response: {
  "success": true,
  "version": "v20251224_143022_3f91c2",
  "url": "http://localhost:4000/cdn/api/theme/dev/..."
}
```

### Get Versions

```
GET /api/admin/theme/versions
Response: {
  "success": true,
  "total": 15,
  "versions": [...]
}
```

### Rollback

```
POST /api/admin/theme/rollback
Body: {"versionId": "v20251224_143022", "env": "dev"}
Response: {"success": true, "rollbackVersion": "rollback_..."}
```

### Get Manifests

```
GET /manifest/public     # Client-safe (no docs)
GET /manifest/admin      # Full with docs
```

### Get Versioned CSS

```
GET /cdn/api/theme/dev/theme_dev_v20251224_143022_3f91c2.css
→ Returns CSS with custom properties
```

---

## File Locations

| File                                      | Purpose                  |
| ----------------------------------------- | ------------------------ |
| `theme-admin/logs/theme-audit.jsonl`      | Audit log                |
| `virtual-cdn/cache/manifest.*.json`       | Manifests                |
| `virtual-cdn/cache/theme_dev_v*.css`      | Published CSS            |
| `theme-admin/public/manifest.admin.json`  | Admin manifest (source)  |
| `theme-admin/public/manifest.public.json` | Public manifest (source) |

---

## Common Commands

```bash
# View audit log
cat theme-admin/logs/theme-audit.jsonl | tail -10

# Check published CSS
ls -lh virtual-cdn/cache/theme_dev*.css

# Check manifests exist
ls -lh virtual-cdn/cache/manifest*.json

# Verify CDN is running
curl http://localhost:4000/health

# Get public manifest
curl http://localhost:4000/manifest/public | jq '.'

# Get version history
curl http://localhost:4000/api/admin/theme/versions | jq '.'
```

---

## Tabs Explained

| Tab       | Purpose                                      |
| --------- | -------------------------------------------- |
| Preview   | Live iframe preview of component             |
| Props     | Edit component HTML properties               |
| Tokens    | Edit design tokens (colors, spacing, radius) |
| Overrides | Component-specific CSS (coming soon)         |
| Docs      | Admin-only documentation                     |

---

## What's Admin-Only?

- ✅ Docs & examples
- ✅ Edit interface
- ✅ Audit logs
- ✅ Version history
- ✅ Rollback feature
- ✅ Component internals

## What Goes to Client?

- ✅ Component name & ID
- ✅ Props schema
- ✅ CSS variable names
- ✅ Web Component bundles

---

## Versioning

**Version ID Format:**

```
v20251224_143022_3f91c2
└─ Date/Time ─┬─ Hash
  YYYYMMDDhhmmss
```

**Example Timeline:**

```
v20251224_120000 → --color-primary: #4f46e5 (original)
v20251224_130530 → --color-primary: #6366f1 (updated)
rollback_143100  → --color-primary: #4f46e5 (restored)
```

---

## Caching Strategy

```
New publish → New version ID → New URL
↓
Browser sees new URL → Fetches fresh CSS
↓
File is immutable → Cache forever (31536000 seconds = 1 year)
↓
Next publish → Different URL → No cache conflicts
```

---

## Troubleshooting

| Problem              | Solution                               |
| -------------------- | -------------------------------------- |
| Manifest not loading | Ensure CDN running, manifests in cache |
| Preview blank        | Check WC bundle URL accessible         |
| Publish fails        | Check logs directory exists            |
| Client has docs      | Verify client types don't import admin |
| Old CSS served       | CDN cache might need invalidation      |

---

## Security Checklist

- [ ] Auth enabled on `/api/admin/*` (for production)
- [ ] Manifests copied to CDN cache
- [ ] Logs directory writable
- [ ] Audit log being written
- [ ] Client doesn't import admin types
- [ ] CORS configured correctly
- [ ] Version IDs are unique
- [ ] Rollback tested

---

## Environment Setup

```bash
# theme-admin/.env.local
NEXT_PUBLIC_CDN_URL=http://localhost:4000
NEXT_PUBLIC_ENV=dev
NEXT_PUBLIC_THEME_URL=http://localhost:4000/cdn/api/theme.json

# theme-client/.env.local
NEXT_PUBLIC_THEME_URL=http://localhost:4000/cdn/api/theme.json
NEXT_PUBLIC_CDN_URL=http://localhost:4000
NEXT_PUBLIC_MANIFEST_URL=http://localhost:4000/manifest/public
```

---

## Quick Test

```bash
# 1. Start services
npm start  # in each directory in separate terminals

# 2. Load catalog
curl http://localhost:3001/admin/components

# 3. Publish test version
curl -X POST http://localhost:3001/api/admin/theme/generate \
  -H "Content-Type: application/json" \
  -d '{
    "componentId": "cti-footer",
    "tokens": {"--color-primary": "#6366f1"},
    "env": "dev"
  }'

# 4. Check file created
ls virtual-cdn/cache/theme_dev*.css

# 5. Check audit log
tail theme-admin/logs/theme-audit.jsonl

# 6. Get versions
curl http://localhost:3001/api/admin/theme/versions

# 7. Verify client manifest has no docs
curl http://localhost:4000/manifest/public | jq '.registry[0]' | grep docs
# Should return nothing
```

---

## Performance Notes

- **Immutable assets**: Cached forever (1 year)
- **Config files**: No-cache, must-revalidate
- **Manifests**: Regenerated on each publish
- **CSS files**: Unique per version (no conflicts)
- **Audit log**: Append-only (fast writes)

---

## For More Information

- **ADMIN_GUIDE.md** - How to use the admin interface
- **README_SYSTEM.md** - System architecture
- **IMPLEMENTATION_CHECKLIST.md** - Testing guide
- **IMPLEMENTATION_SUMMARY.md** - Complete overview

---

**Last Updated**: 2025-12-24  
**Version**: 1.0.0
