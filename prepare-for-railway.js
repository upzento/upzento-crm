const fs = require('fs');
const path = require('path');

console.log('Preparing repository for Railway deployment...');

// Create a .gitattributes file for Git LFS
const gitAttributesContent = `# Archives
*.7z filter=lfs diff=lfs merge=lfs -text
*.br filter=lfs diff=lfs merge=lfs -text
*.gz filter=lfs diff=lfs merge=lfs -text
*.tar filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text

# Documents
*.pdf filter=lfs diff=lfs merge=lfs -text

# Images
*.gif filter=lfs diff=lfs merge=lfs -text
*.ico filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.psd filter=lfs diff=lfs merge=lfs -text
*.webp filter=lfs diff=lfs merge=lfs -text

# Videos
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.webm filter=lfs diff=lfs merge=lfs -text

# Audio
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text

# Fonts
*.woff2 filter=lfs diff=lfs merge=lfs -text

# Other binary files
*.dll filter=lfs diff=lfs merge=lfs -text
*.exe filter=lfs diff=lfs merge=lfs -text
*.so filter=lfs diff=lfs merge=lfs -text
*.dylib filter=lfs diff=lfs merge=lfs -text
`;

fs.writeFileSync('.gitattributes', gitAttributesContent);
console.log('Created .gitattributes file for Git LFS');

// Create a .gitignore-railway file
const gitignoreRailwayContent = `# Keep only essential files for Railway deployment

# Ignore everything
*

# But keep these files
!.gitignore-railway
!.gitattributes
!.railwayignore
!railway.json
!railway.toml
!Dockerfile*
!.dockerignore
!package.json
!package-lock.json
!yarn.lock
!pnpm-lock.yaml

# Frontend files
!frontend/
!frontend/package.json
!frontend/package-lock.json
!frontend/next.config.js
!frontend/tsconfig.json
!frontend/tailwind.config.js
!frontend/postcss.config.js
!frontend/Dockerfile*
!frontend/railway.json
!frontend/health-server.js
!frontend/fix-frontend-encoding.js
!frontend/update-ui-components.js
!frontend/public/**
!frontend/src/**

# Backend files
!backend/
!backend/package.json
!backend/package-lock.json
!backend/tsconfig.json
!backend/Dockerfile*
!backend/railway.json
!backend/health-check.js
!backend/src/**
!backend/prisma/schema.prisma

# Scripts
!*.sh
!*.js
!prepare-for-railway.js
`;

fs.writeFileSync('.gitignore-railway', gitignoreRailwayContent);
console.log('Created .gitignore-railway file');

// Create a README for Railway deployment
const readmeContent = `# Railway Deployment Instructions

This repository is configured for deployment on Railway.

## Deployment Steps

1. Clone this repository
2. Install Git LFS: \`git lfs install\`
3. Rename \`.gitignore-railway\` to \`.gitignore\`: \`mv .gitignore-railway .gitignore\`
4. Push to your GitHub repository
5. Connect your GitHub repository to Railway

## Important Notes

- The \`.gitignore-railway\` file is configured to include only the essential files needed for deployment.
- Large files are tracked using Git LFS to keep the repository size manageable.
- The Dockerfiles are configured to install all dependencies during the build process.
- Health check endpoints are provided for both frontend and backend services.

## Troubleshooting

If you encounter any issues during deployment, check the Railway logs for more information.
`;

fs.writeFileSync('RAILWAY.md', readmeContent);
console.log('Created RAILWAY.md file');

console.log('\nRepository prepared for Railway deployment!');
console.log('To use this configuration:');
console.log('1. Install Git LFS: git lfs install');
console.log('2. Rename .gitignore-railway to .gitignore: mv .gitignore-railway .gitignore');
console.log('3. Push to your GitHub repository');
console.log('4. Connect your GitHub repository to Railway'); 