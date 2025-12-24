# Component Catalog & Style Editor - Admin Guide

## 📋 Overview

The Component Catalog & Style Editor is an **admin-only interface** for managing
Web Components, design tokens, and theme generation. All changes are versioned,
audited, and safely deployed to the CDN.

### Key Principles

- ✅ **Admin-Only**: Documentation, edit tools, and audit logs exist only in the
  admin interface
- ✅ **Versioned**: Every change creates a new version with automatic cache
  busting
- ✅ **Audited**: All modifications logged with timestamp, author, and rollback
  capability
- ✅ **Safe**: Client never sees admin docs or configuration data
- ✅ **Dev-First**: Preview and publish changes in `dev` environment before
  production

---

## 🎯 Getting Started

### 1. Access the Component Catalog

Navigate to `/admin/components` to see all available Web Components with:

- Component name and ID
- Number of props and CSS variables
- Quick edit buttons

### 2. Edit a Component

Click any component card to enter the editor with 5 tabs:

#### **Preview Tab**

- Live preview of the component in an isolated iframe
- Shows real-time rendering as you change props
- Displays HTML markup output

#### **Props Tab**

- Edit component properties (attributes)
- Each prop shows type, default value, and description
- Changes are reflected in preview immediately

#### **Tokens Tab** ⭐

- Edit **Design Tokens** (CSS Custom Properties)
- Includes colors, radius, spacing, and custom variables
- Color picker for color values
- Live preview updates

#### **Overrides Tab**

- Create component-specific CSS overrides
- Coming soon: Advanced CSS editor

#### **Docs Tab** 🔒

- **Admin-only** documentation
- Usage examples
- Accessibility notes
- Never visible to clients

---

## 🎨 Design Tokens - Level 1 (Best Practice)

### What are Design Tokens?

Design tokens are reusable values that define your design system:

- Colors: `--color-primary`, `--color-error`
- Spacing: `--spacing-sm`, `--spacing-lg`
- Radius: `--radius-md`, `--radius-full`

### How to Edit Tokens

1. Open any component → **Tokens tab**
2. For each CSS variable:
   - **Color tokens**: Use color picker or enter hex code
   - **Dimension tokens**: Enter values with units (px, em, rem)
   - **Custom tokens**: Edit as text
3. See changes in **live preview**
4. Click **"Publish Changes"** when satisfied

### Example

```
Before:
--button-bg: #4f46e5
--button-text: #ffffff

After (Published):
--button-bg: #6366f1  ← Updated primary color
--button-text: #f3f4f6  ← Updated text color
```

---

## 🚀 Publishing Changes

### Publishing Flow

1. **Edit tokens/props** in the editor
2. Click **"Publish to CDN"** button
3. System generates:
   - New CSS file with timestamp and hash
   - Version ID for tracking
   - Audit log entry
4. **Version is immediately available** on CDN
5. Client apps can use new version via cache-busted URL

### What Happens When You Publish

1. **CSS Generation**: Tokens converted to CSS custom properties
2. **Versioning**: Unique version ID created (e.g., `v20251224_143022_3f91c2`)
3. **CDN Upload**: CSS file uploaded to virtual-cdn cache
4. **Cache Busting**: URL includes version ID → browsers fetch new version
5. **Audit Log**: Logged with timestamp, author, component, changes
6. **Rollback Ready**: Previous versions available for rollback

### Example Published URLs

```
Before:
http://localhost:4000/cdn/api/theme.css

After:
http://localhost:4000/cdn/api/theme/dev/v20251224_143022.css
http://localhost:4000/cdn/api/theme/dev/v20251224_143022_cti-footer.css
```

---

## 📊 Audit Log & Rollback

### View Version History

1. Go to `/admin/versions` (coming soon)
2. See all published versions with:
   - Version ID
   - Timestamp
   - Author
   - Component affected
   - Changes made

### Rollback to Previous Version

1. Find the version you want to restore
2. Click **"Rollback"** button
3. New version created referencing the original
4. CDN serves the rolled-back CSS

Example:

```
v20251224_143022: PRIMARY=#4f46e5
v20251224_143055: PRIMARY=#6366f1  ← Published by mistake
rollback_20251224_143100: PRIMARY=#4f46e5  ← Restored
```

---

## 🔒 Admin-Only Data Protection

### What's Admin-Only?

The following **never appear in client code**:

- 📄 Component documentation (overview, examples, accessibility)
- 🔧 Admin UI and editors
- 📋 Audit logs
- 🔄 Rollback interface
- ⚙️ System settings

### How It's Enforced

1. **Admin Manifest** (`manifest.admin.json`)

   - Contains full docs and metadata
   - Only served to authenticated admin

2. **Public Manifest** (`manifest.public.json`)

   - Stripped of docs, slots, events
   - Served to all clients
   - Built automatically from admin manifest

3. **Client Type System**

   - `themeTypes.ts` explicitly excludes admin types
   - TypeScript prevents accidental doc usage
   - Bundler tree-shakes unused fields

4. **API Routes**
   - `/api/admin/*` - Admin only (auth required)
   - `/manifest/admin` - Auth required
   - `/manifest/public` - Client-safe

---

## 📱 CSS Variables Available

### Colors

```css
--color-primary: #4f46e5; /* Brand primary */
--color-secondary: #f97316; /* Brand secondary */
--color-success: #22c55e; /* Success state */
--color-warning: #eab308; /* Warning state */
--color-error: #ef4444; /* Error state */
--color-background: #ffffff; /* Default bg */
--color-foreground: #111827; /* Default text */
--color-border: #e5e7eb; /* Border color */
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
--radius-full: 9999px; /* Pill shape */
```

---

## 🔄 Environment Scoping

### Dev vs Production

- **Dev** (`env=dev`): Safe testing ground, publish freely
- **Production**: Requires approval workflow (future)

### Publishing to Dev

```
// Default: dev environment
POST /api/admin/theme/generate
{
  "componentId": "cti-footer",
  "tokens": { "--color-primary": "#6366f1" },
  "env": "dev"  // Change to "prod" when ready
}
```

---

## 🎯 Best Practices

### Do's ✅

- **Preview first**: Use live preview before publishing
- **Semantic naming**: Use descriptive token names
- **Version control**: Keep audit log readable
- **One component at a time**: Publish individual component changes
- **Document changes**: Add descriptions when publishing

### Don'ts ❌

- **Don't override in client**: Client should use CDN tokens
- **Don't hardcode colors**: Use CSS variables
- **Don't publish to prod without testing**: Always test in dev first
- **Don't delete versions**: Keep audit trail intact
- **Don't share admin access lightly**: Log who makes changes

---

## 🛠️ API Reference

### Generate Theme (Publish)

```bash
POST /api/admin/theme/generate

Body:
{
  "componentId": "cti-footer",
  "tokens": {
    "--color-primary": "#6366f1",
    "--spacing-md": "14px"
  },
  "author": "john.doe@example.com",
  "description": "Updated primary color for brand refresh",
  "env": "dev"
}

Response:
{
  "success": true,
  "version": "v20251224_143022_3f91c2",
  "url": "http://localhost:4000/cdn/api/theme/dev/theme_dev_v20251224_143022_3f91c2.css",
  "cssFile": "theme_dev_v20251224_143022_3f91c2.css"
}
```

### Get Version History

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
      "changes": { "--color-primary": "#6366f1" }
    },
    ...
  ]
}
```

### Rollback Version

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
  "message": "Rolled back to version v20251224_143022",
  "rollbackVersion": "rollback_20251224_143100"
}
```

### Invalidate CDN Cache

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

## 🔗 Useful Links

- 📦 **Component Catalog**: `/admin/components`
- 🎨 **Design Tokens**: `/admin/components/[name]?tab=tokens`
- 📊 **Version History**: `/admin/versions`
- 🔄 **Rollback Manager**: `/admin/rollback`
- 📖 **Admin API Docs**: `/admin/api-docs`

---

## ❓ FAQ

**Q: Can clients see the admin docs?**  
A: No. Docs are in `manifest.admin.json` only, and the public manifest strips
them.

**Q: How do I revert a bad publish?**  
A: Use the Rollback feature in `/admin/rollback`. Old version is immediately
restored.

**Q: Can I publish to production directly?**  
A: No. Dev environment only for now. Production requires approval workflow.

**Q: What if I forget to publish changes?**  
A: Changes are only on your local editor. Click "Publish" to make them live on
CDN.

**Q: How long are old versions kept?**  
A: Indefinitely in the audit log. Physical CSS files are cached, but rollback
recreates them.

**Q: Can multiple admins edit at the same time?**  
A: Yes, each edit gets a separate version ID. Audit log shows who changed what
when.

---

## 📞 Support

For issues with the editor, manifest loading, or CDN delivery, check:

1. Browser console for errors
2. Network tab for failed requests
3. Virtual-CDN logs (`terminal output`)
4. Audit log file: `theme-admin/logs/theme-audit.jsonl`

---

**Last Updated**: 2025-12-24  
**Version**: 1.0.0
