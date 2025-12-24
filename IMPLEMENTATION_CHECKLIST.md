# Implementation Checklist

Complete guide to enable and test the Component Catalog & Style Editor system.

## ✅ Already Implemented

- [x] **Manifest Structure**

  - [x] `manifest.admin.json` - Full with docs
  - [x] `manifest.public.json` - Client-safe, docs excluded
  - [x] Design tokens registry (colors, spacing, radius)

- [x] **Admin Routes**

  - [x] `/admin/components` - Catalog page
  - [x] `/admin/components/[name]` - Component editor
  - [x] `/admin/preview/[component]` - Iframe preview

- [x] **Admin Components**

  - [x] ComponentPreview (iframe-based)
  - [x] TokenEditor (color, dimension, custom)
  - [x] ComponentDocs (admin-only documentation)
  - [x] PublishTheme (with versioning)

- [x] **API Endpoints**

  - [x] `POST /api/admin/theme/generate` - Publish theme
  - [x] `GET /api/admin/theme/versions` - List versions
  - [x] `POST /api/admin/theme/rollback` - Rollback version

- [x] **Virtual CDN Updates**

  - [x] Versioned theme serving
  - [x] Manifest endpoints (admin & public)
  - [x] Cache invalidation
  - [x] CORS for all endpoints

- [x] **Client Protection**

  - [x] Client-safe types in `theme-client`
  - [x] Manifest filtering (docs excluded)
  - [x] No admin imports in client

- [x] **Documentation**
  - [x] `ADMIN_GUIDE.md` - Detailed admin instructions
  - [x] `README_SYSTEM.md` - Complete system architecture

---

## 🔧 Next Steps for Production

### 1. Copy Manifest Files to CDN Cache

```bash
cd virtual-cdn
mkdir -p cache
cp ../theme-admin/public/manifest.admin.json cache/
cp ../theme-admin/public/manifest.public.json cache/
```

### 2. Set Environment Variables

**theme-admin/.env.local**

```env
NEXT_PUBLIC_CDN_URL=http://localhost:4000
NEXT_PUBLIC_ENV=dev
NEXT_PUBLIC_THEME_URL=http://localhost:4000/cdn/api/theme.json
```

**theme-client/.env.local**

```env
NEXT_PUBLIC_THEME_URL=http://localhost:4000/cdn/api/theme.json
NEXT_PUBLIC_CDN_URL=http://localhost:4000
NEXT_PUBLIC_MANIFEST_URL=http://localhost:4000/manifest/public
```

**virtual-cdn/.env** (if needed)

```env
ORIGIN=http://localhost:3001
PORT=4000
```

### 3. Create Directories

```bash
# Create logs directory for audit trail
mkdir -p theme-admin/logs

# Ensure cache directory exists
mkdir -p virtual-cdn/cache
```

### 4. Start Services (in order)

**Terminal 1: Virtual CDN**

```bash
cd virtual-cdn
npm install
npm start
# Waits for http://localhost:4000
```

**Terminal 2: Admin Interface**

```bash
cd theme-admin
npm install
npm run dev
# Waits for http://localhost:3001
```

**Terminal 3: Client App**

```bash
cd theme-client
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## ✔️ Test Checklist

### Test 1: Catalog Loading

- [ ] Navigate to `http://localhost:3001/admin/components`
- [ ] See list of 3 components (cti-footer, cti-footer-hover, cti-footer-modal)
- [ ] Click a component to open editor

### Test 2: Component Editor

- [ ] See all 5 tabs: Preview, Props, Tokens, Overrides, Docs
- [ ] Preview tab shows iframe
- [ ] Props tab shows editable fields
- [ ] Tokens tab shows color picker and values
- [ ] Docs tab shows admin-only documentation
- [ ] Overrides tab says "coming soon"

### Test 3: Live Preview

- [ ] Change a prop in Props tab
- [ ] Preview updates immediately in iframe
- [ ] Edit color in Tokens tab
- [ ] Preview reflects color change

### Test 4: Publish Theme

- [ ] Edit a token (e.g., change --color-primary)
- [ ] Click "Publish to CDN"
- [ ] See success message with version ID
- [ ] Check that file exists in `virtual-cdn/cache/theme_dev_v*.css`

### Test 5: Audit Log

- [ ] Check file: `theme-admin/logs/theme-audit.jsonl`
- [ ] Should have entry for published version
- [ ] Shows timestamp, componentId, tokens, env

### Test 6: Client Protection

- [ ] In theme-client, check: `src/lib/themeTypes.ts`
- [ ] Should NOT have `docs` field in ComponentRegistry
- [ ] In theme-client, check: `src/lib/manifestClient.ts`
- [ ] Should filter out docs from manifest

### Test 7: Manifest Endpoints

**Public Manifest (safe for client)**

```bash
curl http://localhost:4000/manifest/public | jq '.registry[0]'
# Should NOT have: docs, slots, events, adminOnly
```

**Admin Manifest (full data)**

```bash
curl http://localhost:4000/manifest/admin | jq '.registry[0]'
# Should have: docs, slots, events, adminOnly, descriptions
```

### Test 8: Versioned CSS Serving

- [ ] Publish a theme
- [ ] Get the CSS URL from response
- [ ] Fetch directly:
      `curl http://localhost:4000/cdn/api/theme/dev/theme_dev_v*.css`
- [ ] Should return CSS with custom properties

### Test 9: Rollback

- [ ] Publish version 1 with primary=#4f46e5
- [ ] Publish version 2 with primary=#6366f1
- [ ] Call: `POST /api/admin/theme/rollback` with version 1
- [ ] Verify new rollback version created

### Test 10: Admin-Only Enforcement

- [ ] Try to access admin docs from client code (should get TypeScript error)
- [ ] Client build should not include docs field
- [ ] Client manifest should have smaller file size than admin

---

## 🚀 Production Deployment

### Before Going Live

1. **Set up authentication**

   ```typescript
   // theme-admin/app/api/admin/theme/generate/route.ts
   // Add auth middleware before processing
   const user = await authenticate(request);
   if (!user?.role?.includes("admin")) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }
   ```

2. **Set up environment scoping**

   ```bash
   # Only allow dev -> prod promotion with approval
   # Store current version in database
   # Create approval workflow for prod publishes
   ```

3. **Set up monitoring**

   ```bash
   # Monitor logs/theme-audit.jsonl
   # Alert on unusual publish patterns
   # Track CDN cache hit rates
   ```

4. **Set up backups**

   ```bash
   # Backup audit log daily
   # Backup CDN cache periodically
   # Version control manifest files
   ```

5. **Configure CORS properly**
   ```javascript
   // In production, don't allow "*"
   // Use specific domain list
   const ALLOWED_ORIGINS = ["https://app.example.com"];
   ```

### Deployment Steps

1. Deploy theme-admin to your hosting
2. Deploy virtual-cdn to CDN or server
3. Deploy theme-client to production
4. Update environment variables
5. Enable authentication in admin APIs
6. Set up monitoring and alerts
7. Create runbook for rollback procedures

---

## 📊 Expected File Sizes

After implementation, you should see:

```
theme-admin/
├── public/
│   ├── manifest.admin.json    ~5KB (with all docs)
│   └── manifest.public.json   ~2KB (stripped)
├── logs/
│   └── theme-audit.jsonl      grows over time
└── cache/ (if local)

virtual-cdn/
├── cache/
│   ├── manifest.*.json        ~5KB each
│   └── theme_dev_v*.css       ~1-2KB each
└── public/wc/
    └── *.js                   (web component bundles)

theme-client/
├── src/lib/
│   ├── themeTypes.ts          ~1KB (no docs)
│   └── manifestClient.ts      ~2KB
```

---

## 🔍 Common Issues & Solutions

### Issue: Manifest not loading

**Solution**: Ensure virtual-cdn cache directory exists and manifests are copied
there

```bash
mkdir -p virtual-cdn/cache
cp theme-admin/public/manifest*.json virtual-cdn/cache/
```

### Issue: Preview iframe blank

**Solution**: Check that WC bundles are accessible

```bash
curl http://localhost:4000/cdn/wc/cti-footer.js
# Should return JavaScript content
```

### Issue: Publish returns 404

**Solution**: Check that logs directory exists

```bash
mkdir -p theme-admin/logs
chmod 755 theme-admin/logs
```

### Issue: Client still has docs

**Solution**: Verify client types don't import admin types

```bash
grep -r "adminOnly\|ComponentDoc" theme-client/src/
# Should return nothing
```

### Issue: Version IDs are the same

**Solution**: Versioning depends on token changes

```javascript
// If tokens are identical, hash will be same
// Always make actual changes before publishing
```

---

## 📚 Additional Resources

- **Admin Guide**: See [ADMIN_GUIDE.md](./theme-admin/ADMIN_GUIDE.md)
- **System Architecture**: See [README_SYSTEM.md](./README_SYSTEM.md)
- **API Routes**: Check route files in `theme-admin/app/api/admin/`
- **Virtual CDN**: Check `virtual-cdn/server.js`

---

## ✨ Success Indicators

You'll know everything is working when:

1. ✅ Can access `/admin/components` and see component list
2. ✅ Can edit tokens and see live preview update
3. ✅ Can publish and see version ID returned
4. ✅ CSS file created in virtual-cdn/cache with version ID
5. ✅ Audit log has entries in logs/theme-audit.jsonl
6. ✅ Client manifest doesn't have docs field
7. ✅ Can rollback to previous version
8. ✅ Old CSS files are immutable (long cache)
9. ✅ New CSS files are different from old
10. ✅ Client never loads admin endpoints

---

**Status**: ✅ Implementation Complete  
**Ready for**: Local testing, integration, production deployment  
**Last Updated**: 2025-12-24
