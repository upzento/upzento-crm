const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Copy files to the clean repository
console.log('Copying files to the clean repository...');

// Define the clean repository directory
const cleanRepoDir = path.join(__dirname, 'clean-railway-repo');

// Function to copy a file if it exists
function copyFileIfExists(src, dest) {
  if (fs.existsSync(src)) {
    // Ensure the destination directory exists
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
    return true;
  } else {
    console.log(`Warning: File ${src} not found`);
    return false;
  }
}

// Function to copy directory recursively
function copyDirRecursive(src, dest, excludes = []) {
  if (!fs.existsSync(src)) {
    console.log(`Warning: Directory ${src} not found`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip excluded paths
    if (excludes.some(exclude => srcPath.includes(exclude))) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, excludes);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// Copy frontend files
console.log('Copying frontend files...');
const frontendFiles = [
  'package.json',
  'next.config.js',
  'Dockerfile.new',
  'railway.json',
  'health-server.js',
  'update-ui-components.js',
  'fix-frontend-encoding.js'
];

frontendFiles.forEach(file => {
  copyFileIfExists(
    path.join(__dirname, 'frontend', file),
    path.join(cleanRepoDir, 'frontend', file)
  );
});

// Copy frontend src and public directories
console.log('Copying frontend src and public directories...');
copyDirRecursive(
  path.join(__dirname, 'frontend', 'src'),
  path.join(cleanRepoDir, 'frontend', 'src'),
  ['node_modules']
);
copyDirRecursive(
  path.join(__dirname, 'frontend', 'public'),
  path.join(cleanRepoDir, 'frontend', 'public'),
  []
);

// Copy backend files
console.log('Copying backend files...');
const backendFiles = [
  'package.json',
  'Dockerfile',
  'railway.json',
  'health-check.js'
];

backendFiles.forEach(file => {
  copyFileIfExists(
    path.join(__dirname, 'backend', file),
    path.join(cleanRepoDir, 'backend', file)
  );
});

// Copy backend src directory and prisma schema
console.log('Copying backend src directory and prisma schema...');
copyDirRecursive(
  path.join(__dirname, 'backend', 'src'),
  path.join(cleanRepoDir, 'backend', 'src'),
  ['node_modules']
);
copyFileIfExists(
  path.join(__dirname, 'backend', 'prisma', 'schema.prisma'),
  path.join(cleanRepoDir, 'backend', 'prisma', 'schema.prisma')
);

// Initialize git in the clean repository
console.log('Initializing git repository...');
try {
  execSync('git init', { cwd: cleanRepoDir });
  execSync('git add .', { cwd: cleanRepoDir });
  execSync('git commit -m "Initial commit for Railway deployment"', { cwd: cleanRepoDir });
  console.log('Git repository initialized');
} catch (error) {
  console.error('Error initializing git repository:', error.message);
}

console.log('\nFiles copied to the clean repository');
console.log('\nNext steps:');
console.log('1. Create a new repository on GitHub');
console.log('2. Add the remote: cd clean-railway-repo && git remote add origin your-github-repo-url');
console.log('3. Push to GitHub: git push -u origin main');
console.log('4. Connect the GitHub repository to Railway');
