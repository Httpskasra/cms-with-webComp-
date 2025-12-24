@echo off
REM setup.bat - Complete setup script for Component Catalog system (Windows)

setlocal enabledelayedexpansion

echo.
echo 🚀 Setting up Component Catalog ^& Style Editor System
echo ======================================================
echo.

REM Step 1: Create necessary directories
echo [1/6] Creating directories...
if not exist "virtual-cdn\cache" mkdir virtual-cdn\cache
if not exist "theme-admin\logs" mkdir theme-admin\logs
echo ✅ Directories created
echo.

REM Step 2: Copy manifest files to CDN cache
echo [2/6] Copying manifest files...
if exist "theme-admin\public\manifest.admin.json" (
    copy "theme-admin\public\manifest.admin.json" "virtual-cdn\cache\" >nul
    copy "theme-admin\public\manifest.public.json" "virtual-cdn\cache\" >nul
    echo ✅ Manifests copied to CDN cache
) else (
    echo ⚠️  Manifest files not found. Run this script from repo root.
)
echo.

REM Step 3: Create environment files if they don't exist
echo [3/6] Setting up environment files...

if not exist "theme-admin\.env.local" (
    (
        echo NEXT_PUBLIC_CDN_URL=http://localhost:4000
        echo NEXT_PUBLIC_ENV=dev
        echo NEXT_PUBLIC_THEME_URL=http://localhost:4000/cdn/api/theme.json
    ) > "theme-admin\.env.local"
    echo ✅ Created theme-admin\.env.local
) else (
    echo ⚠️  theme-admin\.env.local already exists
)

if not exist "theme-client\.env.local" (
    (
        echo NEXT_PUBLIC_THEME_URL=http://localhost:4000/cdn/api/theme.json
        echo NEXT_PUBLIC_CDN_URL=http://localhost:4000
        echo NEXT_PUBLIC_MANIFEST_URL=http://localhost:4000/manifest/public
    ) > "theme-client\.env.local"
    echo ✅ Created theme-client\.env.local
) else (
    echo ⚠️  theme-client\.env.local already exists
)
echo.

REM Step 4: Install dependencies
echo [4/6] Installing dependencies...

echo Installing virtual-cdn...
cd virtual-cdn
call npm install >nul 2>&1
cd ..
echo ✅ virtual-cdn ready

echo Installing theme-admin...
cd theme-admin
call npm install >nul 2>&1
cd ..
echo ✅ theme-admin ready

echo Installing theme-client...
cd theme-client
call npm install >nul 2>&1
cd ..
echo ✅ theme-client ready
echo.

REM Step 5: Display completion
echo [5/6] Setup complete!
echo.
echo ✨ Component Catalog System is ready!
echo.

REM Step 6: Show next steps
echo [6/6] Next steps:
echo.
echo Start the services in separate terminals:
echo.
echo Terminal 1 - Virtual CDN:
echo   cd virtual-cdn ^& npm start
echo.
echo Terminal 2 - Admin Interface:
echo   cd theme-admin ^& npm run dev
echo.
echo Terminal 3 - Client App:
echo   cd theme-client ^& npm run dev
echo.
echo Then visit:
echo   📋 Admin Catalog: http://localhost:3001/admin/components
echo   🎨 Client App: http://localhost:3000
echo   📡 CDN Health: http://localhost:4000/health
echo.
echo For detailed documentation, see:
echo   📖 ADMIN_GUIDE.md - How to use the admin interface
echo   📐 README_SYSTEM.md - Complete system architecture
echo   ✅ IMPLEMENTATION_CHECKLIST.md - Testing ^& deployment
echo.
echo Happy theming! 🎉
echo.

pause
