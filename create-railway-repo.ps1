Write-Host 'Creating clean repository for Railway deployment...' -ForegroundColor Green

# Create directory for clean repository
$repoDir = "railway-repo"
if (Test-Path $repoDir) {
    Write-Host "Directory $repoDir already exists. Please remove it first." -ForegroundColor Red
    exit
}

New-Item -Path $repoDir -ItemType Directory | Out-Null
Set-Location $repoDir

# Initialize git repository
Write-Host "Initializing git repository..." -ForegroundColor Green
git init
git lfs install

# Create directories
Write-Host "Creating directory structure..." -ForegroundColor Green
New-Item -Path "frontend\src" -ItemType Directory -Force | Out-Null
New-Item -Path "frontend\public" -ItemType Directory -Force | Out-Null
New-Item -Path "backend\src" -ItemType Directory -Force | Out-Null
New-Item -Path "backend\prisma" -ItemType Directory -Force | Out-Null
