#!/bin/bash
set -e

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate || echo "WARNING: Prisma generate failed but continuing build"

# Build the application using npm script
echo "Building the application..."
npm run build

echo "Build completed successfully!"
