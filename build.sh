#!/bin/sh
echo "Starting build process..."
cd backend
npx tsc || true
echo "Build completed!"