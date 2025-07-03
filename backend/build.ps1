# Simple build script that uses tsc with skipLibCheck
Write-Output "Building backend with tsc..."
npx tsc --skipLibCheck
Write-Output "Build completed!" 