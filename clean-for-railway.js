const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create a new directory for the clean repository
const cleanRepoDir = path.join(__dirname, 'railway-repo');
if (!fs.existsSync(cleanRepoDir)) {
  fs.mkdirSync(cleanRepoDir, { recursive: true });
}

// Function to ensure a directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Function to copy a file
function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
  } else {
    console.log(`Warning: Source file not found: ${src}`);
  }
}

// Function to copy a directory recursively
function copyDir(src, dest, excludes = []) {
  if (!fs.existsSync(src)) {
    console.log(`Warning: Source directory not found: ${src}`);
    return;
  }

  ensureDir(dest);
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // Skip excluded paths
    if (excludes.some(exclude => srcPath.includes(exclude))) {
      continue;
    }
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, excludes);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

console.log('Creating clean repository for Railway...');

// Copy essential files from the root directory
const rootFiles = [
  '.gitattributes',
  '.railwayignore',
  'railway.json',
  'railway.toml',
  'package.json',
  'package-lock.json',
  'RAILWAY.md',
];

rootFiles.forEach(file => {
  copyFile(path.join(__dirname, file), path.join(cleanRepoDir, file));
});

// Copy README.md as README.md
copyFile(path.join(__dirname, 'RAILWAY.md'), path.join(cleanRepoDir, 'README.md'));

// Create frontend directory
const frontendDir = path.join(cleanRepoDir, 'frontend');
ensureDir(frontendDir);

// Copy frontend files
const frontendFiles = [
  'package.json',
  'package-lock.json',
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.js',
  'postcss.config.js',
  'Dockerfile',
  'Dockerfile.new',
  'railway.json',
  'health-server.js',
  'fix-frontend-encoding.js',
  'update-ui-components.js',
];

frontendFiles.forEach(file => {
  copyFile(path.join(__dirname, 'frontend', file), path.join(frontendDir, file));
});

// Copy frontend source and public directories
copyDir(path.join(__dirname, 'frontend', 'src'), path.join(frontendDir, 'src'), ['node_modules']);
copyDir(path.join(__dirname, 'frontend', 'public'), path.join(frontendDir, 'public'), ['node_modules']);

// Create backend directory
const backendDir = path.join(cleanRepoDir, 'backend');
ensureDir(backendDir);

// Copy backend files
const backendFiles = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'Dockerfile',
  'railway.json',
  'health-check.js',
];

backendFiles.forEach(file => {
  copyFile(path.join(__dirname, 'backend', file), path.join(backendDir, file));
});

// Copy backend source directory
copyDir(path.join(__dirname, 'backend', 'src'), path.join(backendDir, 'src'), ['node_modules']);

// Copy backend prisma directory
copyDir(path.join(__dirname, 'backend', 'prisma'), path.join(backendDir, 'prisma'), ['node_modules']);

// Create a new .gitignore file
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
console.log('Created new .gitignore file');

// Initialize git repository
try {
  execSync('git init', { cwd: cleanRepoDir });
  console.log('Initialized git repository');
  
  // Setup Git LFS
  execSync('git lfs install', { cwd: cleanRepoDir });
  console.log('Installed Git LFS');
  
  // Add all files
  execSync('git add .', { cwd: cleanRepoDir });
  console.log('Added files to git');
  
  // Initial commit
  execSync('git commit -m "Initial commit for Railway deployment"', { cwd: cleanRepoDir });
  console.log('Created initial commit');
} catch (error) {
  console.error('Error setting up git repository:', error.message);
}

console.log('\nClean repository created at:', cleanRepoDir);
console.log('\nNext steps:');
console.log('1. Create a new repository on GitHub');
console.log('2. Add the remote: git remote add origin <your-github-repo-url>');
console.log('3. Push to GitHub: git push -u origin main');
console.log('4. Connect the GitHub repository to Railway'); 