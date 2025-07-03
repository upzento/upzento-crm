const fs = require('fs');
const path = require('path');

console.log('Creating clean repository for Railway deployment...');

// Define the clean repository directory
const cleanRepoDir = path.join(__dirname, 'clean-railway-repo');

// Check if the directory already exists
if (fs.existsSync(cleanRepoDir)) {
  console.log(`Directory ${cleanRepoDir} already exists. Removing it...`);
  fs.rmSync(cleanRepoDir, { recursive: true, force: true });
}

// Create the clean repository directory
fs.mkdirSync(cleanRepoDir, { recursive: true });
console.log(`Created directory: ${cleanRepoDir}`);

// Create the directory structure
const dirs = [
  path.join(cleanRepoDir, 'frontend', 'src'),
  path.join(cleanRepoDir, 'frontend', 'public'),
  path.join(cleanRepoDir, 'backend', 'src'),
  path.join(cleanRepoDir, 'backend', 'prisma')
];

dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`Created directory: ${dir}`);
});

// Create a proper .gitignore file
console.log('Creating .gitignore file...');
const gitignoreContent = `# Dependencies
node_modules/
.pnp/
.pnp.js
.yarn/

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.development
.env.test
.env.production
.env.staging
.env*.local
!.env.example

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Temporary files
tmp/
temp/
*.tmp
*.temp
*.bak
*.backup
*.swp

# OS files
.DS_Store
Thumbs.db

# IDE files
.idea/
.vscode/
`;

fs.writeFileSync(path.join(cleanRepoDir, '.gitignore'), gitignoreContent);
console.log('Created .gitignore file');

// Create a README file
console.log('Creating README file...');
const readmeContent = `# Upzento CRM - Railway Deployment

This is a clean repository for deploying Upzento CRM to Railway.

## Structure

- \`frontend/\`: Next.js frontend application
- \`backend/\`: NestJS backend application

## Deployment

1. Push this repository to GitHub
2. Connect the GitHub repository to Railway
3. Configure the environment variables in Railway
4. Deploy the application
`;

fs.writeFileSync(path.join(cleanRepoDir, 'README.md'), readmeContent);
console.log('Created README file');

console.log('\nClean repository created in', cleanRepoDir);
console.log('\nNext steps:');
console.log('1. Copy your frontend and backend files to the clean repository');
console.log('2. Initialize git and push to GitHub');
console.log('3. Connect the GitHub repository to Railway');
