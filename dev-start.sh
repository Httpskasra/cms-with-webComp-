#!/bin/bash

# Start all dev servers for the theme platform
# Run this from the root directory of the project

echo ""
echo "========================================"
echo "Starting Theme Platform (Development)"
echo "========================================"
echo ""

# Check if all directories exist
for dir in virtual-cdn wc-react theme-admin theme-client; do
    if [ ! -d "$dir" ]; then
        echo "Error: $dir directory not found"
        exit 1
    fi
done

# Check Node.js
echo "Step 1: Check Node.js"
node --version

echo ""
echo "Step 2: Install dependencies (if needed)"

for dir in virtual-cdn wc-react theme-admin theme-client; do
    if [ ! -d "$dir/node_modules" ]; then
        echo "Installing $dir dependencies..."
        cd "$dir" || exit
        npm install
        cd ..
    fi
done

echo ""
echo "========================================"
echo "Starting Services"
echo "========================================"
echo ""

# Function to start service in background
start_service() {
    local name=$1
    local cmd=$2
    echo "Starting $name..."
    eval "$cmd" &
    echo "  PID: $!"
    sleep 2
}

# Start services
start_service "Virtual CDN (http://localhost:4000)" "cd virtual-cdn && NODE_ENV=development node server.js"
start_service "wc-react Builder" "cd wc-react && npm run build:watch"
start_service "theme-admin (http://localhost:3001)" "cd theme-admin && npm run dev"
start_service "theme-client (http://localhost:3000)" "cd theme-client && npm run dev"

echo ""
echo "========================================"
echo "All services started!"
echo "========================================"
echo ""
echo "Access:"
echo "  - theme-client:  http://localhost:3000"
echo "  - theme-admin:   http://localhost:3001/admin/components"
echo "  - virtual-cdn:   http://localhost:4000"
echo ""
echo "To stop all services, press Ctrl+C or run: pkill -P $$"
echo ""

# Keep script running
wait

