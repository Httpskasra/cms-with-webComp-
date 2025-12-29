@echo off
REM Start all dev servers for the theme platform
REM Run this from the root directory of the project

echo.
echo ========================================
echo Starting Theme Platform (Development)
echo ========================================
echo.

REM Check if all directories exist
if not exist "virtual-cdn" (
    echo Error: virtual-cdn directory not found
    exit /b 1
)
if not exist "wc-react" (
    echo Error: wc-react directory not found
    exit /b 1
)
if not exist "theme-admin" (
    echo Error: theme-admin directory not found
    exit /b 1
)
if not exist "theme-client" (
    echo Error: theme-client directory not found
    exit /b 1
)

echo Step 1: Check Node.js
node --version

echo.
echo Step 2: Install dependencies (if needed)
if not exist "virtual-cdn\node_modules" (
    echo Installing virtual-cdn dependencies...
    cd virtual-cdn && call npm install && cd ..
)
if not exist "wc-react\node_modules" (
    echo Installing wc-react dependencies...
    cd wc-react && call npm install && cd ..
)
if not exist "theme-admin\node_modules" (
    echo Installing theme-admin dependencies...
    cd theme-admin && call npm install && cd ..
)
if not exist "theme-client\node_modules" (
    echo Installing theme-client dependencies...
    cd theme-client && call npm install && cd ..
)

echo.
echo ========================================
echo Starting Services
echo ========================================
echo.
echo Opening new terminals...
echo.
echo 1. Virtual CDN (http://localhost:4000)
start "Virtual CDN" cmd /k "cd virtual-cdn && NODE_ENV=development node server.js"

echo 2. Waiting 2 seconds...
timeout /t 2 /nobreak

echo 3. wc-react Builder
start "wc-react Builder" cmd /k "cd wc-react && npm run build:watch"

echo 4. Waiting 2 seconds...
timeout /t 2 /nobreak

echo 5. theme-admin (http://localhost:3001)
start "theme-admin" cmd /k "cd theme-admin && npm run dev"

echo 6. Waiting 2 seconds...
timeout /t 2 /nobreak

echo 7. theme-client (http://localhost:3000)
start "theme-client" cmd /k "cd theme-client && npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Access:
echo   - theme-client:  http://localhost:3000
echo   - theme-admin:   http://localhost:3001/admin/components
echo   - virtual-cdn:   http://localhost:4000
echo.
echo Close any terminal window to stop that service
echo.
pause
