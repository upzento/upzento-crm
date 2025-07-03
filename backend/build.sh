#!/bin/bash
set -e

echo "Starting build process..."

# Build the application with skipLibCheck flag
echo "Building the application with skipLibCheck..."
npx nest build --skipLibCheck

echo "Build process completed!"
