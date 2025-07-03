const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to get the size of a file or directory
function getSize(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  
  const stats = fs.statSync(filePath);
  if (stats.isFile()) {
    return stats.size;
  } else if (stats.isDirectory()) {
    let totalSize = 0;
    const files = fs.readdirSync(filePath);
    for (const file of files) {
      totalSize += getSize(path.join(filePath, file));
    }
    return totalSize;
  }
  return 0;
}

// Function to format size in human-readable format
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// Function to find large files in the repository
function findLargeFiles(dir, threshold = 10 * 1024 * 1024, results = []) { // Default threshold: 10MB
  if (!fs.existsSync(dir)) return results;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    
    // Skip node_modules and .git directories
    if (/node_modules|\.git/.test(filePath)) continue;
    
    const stats = fs.statSync(filePath);
    
    if (stats.isFile() && stats.size > threshold) {
      results.push({
        path: filePath,
        size: stats.size,
        formattedSize: formatSize(stats.size)
      });
    } else if (stats.isDirectory()) {
      findLargeFiles(filePath, threshold, results);
    }
  }
  
  return results;
}

// Function to create a .gitattributes file for Git LFS
function createGitAttributes() {
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
}

// Main function
function main() {
  console.log('Optimizing repository for Railway deployment...');
  
  // Create .gitattributes file for Git LFS
  createGitAttributes();
  
  // Find large files
  console.log('Finding large files (>10MB)...');
  const largeFiles = findLargeFiles('.', 10 * 1024 * 1024);
  
  if (largeFiles.length > 0) {
    console.log(`\nFound ${largeFiles.length} large files:`);
    largeFiles.forEach(file => {
      console.log(`${file.path} (${file.formattedSize})`);
    });
    
    console.log('\nRecommendations:');
    console.log('1. Consider using Git LFS for these large files');
    console.log('2. Add them to .gitignore if they are not needed for deployment');
    console.log('3. Move them to external storage and download them during deployment');
  } else {
    console.log('No large files found.');
  }
  
  // Check repository size
  console.log('\nChecking repository size...');
  const repoSize = getSize('.');
  console.log(`Total repository size: ${formatSize(repoSize)}`);
  
  // Check node_modules size
  const frontendNodeModulesSize = getSize('./frontend/node_modules');
  const backendNodeModulesSize = getSize('./backend/node_modules');
  
  console.log(`Frontend node_modules size: ${formatSize(frontendNodeModulesSize)}`);
  console.log(`Backend node_modules size: ${formatSize(backendNodeModulesSize)}`);
  
  // Create a deployment script
  const deploymentScript = `#!/bin/bash
# This script prepares the repository for deployment to Railway

# Clean up node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules

# Create empty directories to maintain structure
mkdir -p frontend/node_modules
mkdir -p backend/node_modules

# Create placeholder files
echo "# This directory is populated during deployment" > frontend/node_modules/README.md
echo "# This directory is populated during deployment" > backend/node_modules/README.md

echo "Repository prepared for deployment to Railway!"
`;

  fs.writeFileSync('prepare-for-railway.sh', deploymentScript);
  console.log('\nCreated prepare-for-railway.sh script');
  
  console.log('\nOptimization complete!');
  console.log('Run the prepare-for-railway.sh script before pushing to GitHub to reduce repository size.');
}

// Run the main function
main(); 