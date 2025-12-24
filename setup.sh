#!/bin/bash
# setup.sh - Complete setup script for Component Catalog system

set -e

echo "🚀 Setting up Component Catalog & Style Editor System"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Create necessary directories
echo -e "${BLUE}[1/6]${NC} Creating directories..."
mkdir -p virtual-cdn/cache
mkdir -p theme-admin/logs
echo -e "${GREEN}✅ Directories created${NC}"

# Step 2: Copy manifest files to CDN cache
echo -e "${BLUE}[2/6]${NC} Copying manifest files..."
if [ -f "theme-admin/public/manifest.admin.json" ]; then
    cp theme-admin/public/manifest.admin.json virtual-cdn/cache/
    cp theme-admin/public/manifest.public.json virtual-cdn/cache/
    echo -e "${GREEN}✅ Manifests copied to CDN cache${NC}"
else
    echo -e "${YELLOW}⚠️  Manifest files not found. Run this script from repo root.${NC}"
fi

# Step 3: Create environment files if they don't exist
echo -e "${BLUE}[3/6]${NC} Setting up environment files..."

if [ ! -f "theme-admin/.env.local" ]; then
    cat > theme-admin/.env.local << 'EOF'
NEXT_PUBLIC_CDN_URL=http://localhost:4000
NEXT_PUBLIC_ENV=dev
NEXT_PUBLIC_THEME_URL=http://localhost:4000/cdn/api/theme.json
EOF
    echo -e "${GREEN}✅ Created theme-admin/.env.local${NC}"
else
    echo -e "${YELLOW}⚠️  theme-admin/.env.local already exists${NC}"
fi

if [ ! -f "theme-client/.env.local" ]; then
    cat > theme-client/.env.local << 'EOF'
NEXT_PUBLIC_THEME_URL=http://localhost:4000/cdn/api/theme.json
NEXT_PUBLIC_CDN_URL=http://localhost:4000
NEXT_PUBLIC_MANIFEST_URL=http://localhost:4000/manifest/public
EOF
    echo -e "${GREEN}✅ Created theme-client/.env.local${NC}"
else
    echo -e "${YELLOW}⚠️  theme-client/.env.local already exists${NC}"
fi

# Step 4: Install dependencies
echo -e "${BLUE}[4/6]${NC} Installing dependencies..."
echo -e "${YELLOW}Installing virtual-cdn...${NC}"
cd virtual-cdn
npm install > /dev/null 2>&1
cd ..
echo -e "${GREEN}✅ virtual-cdn ready${NC}"

echo -e "${YELLOW}Installing theme-admin...${NC}"
cd theme-admin
npm install > /dev/null 2>&1
cd ..
echo -e "${GREEN}✅ theme-admin ready${NC}"

echo -e "${YELLOW}Installing theme-client...${NC}"
cd theme-client
npm install > /dev/null 2>&1
cd ..
echo -e "${GREEN}✅ theme-client ready${NC}"

# Step 5: Display instructions
echo -e "${BLUE}[5/6]${NC} Setup complete!"
echo ""
echo -e "${GREEN}✨ Component Catalog System is ready!${NC}"
echo ""

# Step 6: Show next steps
echo -e "${BLUE}[6/6]${NC} Next steps:"
echo ""
echo "Start the services in separate terminals:"
echo ""
echo -e "${YELLOW}Terminal 1 - Virtual CDN:${NC}"
echo "  cd virtual-cdn && npm start"
echo ""
echo -e "${YELLOW}Terminal 2 - Admin Interface:${NC}"
echo "  cd theme-admin && npm run dev"
echo ""
echo -e "${YELLOW}Terminal 3 - Client App:${NC}"
echo "  cd theme-client && npm run dev"
echo ""
echo "Then visit:"
echo "  📋 Admin Catalog: http://localhost:3001/admin/components"
echo "  🎨 Client App: http://localhost:3000"
echo "  📡 CDN Health: http://localhost:4000/health"
echo ""
echo "For detailed documentation, see:"
echo "  📖 ADMIN_GUIDE.md - How to use the admin interface"
echo "  📐 README_SYSTEM.md - Complete system architecture"
echo "  ✅ IMPLEMENTATION_CHECKLIST.md - Testing & deployment"
echo ""
echo -e "${GREEN}Happy theming! 🎉${NC}"
