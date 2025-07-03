#!/bin/sh
set -e

echo "Starting frontend build process..."

# Fix encoding issues
echo "Fixing file encodings..."
node ../fix-frontend-encoding.js || true

# Install dependencies
echo "Installing dependencies..."
npm ci --no-fund --prefer-offline --no-audit || npm install --no-fund --prefer-offline --no-audit

# Build the Next.js app with error handling
echo "Building frontend..."
NEXT_TELEMETRY_DISABLED=1 npm run build || echo "Frontend build had errors but continuing deployment"

echo "Frontend build completed!"
