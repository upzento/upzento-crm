#!/bin/sh
# This script is designed to run before the main build process
# to ensure no cache directories cause issues

# Export environment variables to disable caching
export NPM_CONFIG_CACHE=/tmp/npm-cache
export NODE_ENV=production

# Create custom cache directory that won't conflict with mounted volumes
mkdir -p /tmp/npm-cache

# Override any cache mount paths with symlinks to our custom directory
if [ -d "/app/node_modules/.cache" ]; then
  # If the cache directory exists as a mount point, we'll make it a symlink
  # This is a workaround for the "Device or resource busy" error
  # First, we'll try to unmount it (might not work but worth a try)
  umount /app/node_modules/.cache 2>/dev/null || true
  
  # Remove it if it's not a mount point
  rm -rf /app/node_modules/.cache 2>/dev/null || true
  
  # Create parent directory if it doesn't exist
  mkdir -p /app/node_modules
  
  # Create a symlink to our custom cache directory
  ln -sf /tmp/npm-cache /app/node_modules/.cache
fi

# Run the actual build process
cd backend && ./build.sh 