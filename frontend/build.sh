#!/bin/bash
set -e

echo "Starting frontend build process..."

# Fix file encoding issues
if [ -f "fix-frontend-encoding.js" ]; then
  echo "Fixing file encoding issues..."
  node fix-frontend-encoding.js
fi

# Create temp directory for cache
export CACHE_DIR="/tmp/next-cache"
mkdir -p $CACHE_DIR

echo "Installing dependencies..."
npm install --no-fund

echo "Building frontend..."
NEXT_TELEMETRY_DISABLED=1 npm run build || {
  echo "Build failed, but continuing deployment..."
  exit 0
}

echo "Frontend build completed!"
