const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting gitignore fix process...');

try {
  // Step 1: Copy the new gitignore file to the main one
  if (fs.existsSync('.gitignore.new')) {
    console.log('Copying .gitignore.new to .gitignore');
    fs.copyFileSync('.gitignore.new', '.gitignore');
  } else {
    console.log('.gitignore.new not found, skipping copy step');
  }

  // Step 2: Remove all files from git cache
  console.log('Removing all files from git cache...');
  execSync('git rm -r --cached .', { stdio: 'inherit' });

  // Step 3: Re-add all files (this will respect the new .gitignore)
  console.log('Re-adding all files according to the new .gitignore...');
  execSync('git add .', { stdio: 'inherit' });

  console.log('\nGit cache has been cleared and files have been re-added according to the new .gitignore file.');
  console.log('Now you can commit these changes with: git commit -m "Fixed gitignore issues"');
} catch (error) {
  console.error('An error occurred:', error.message);
}
