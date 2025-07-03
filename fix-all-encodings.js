const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Function to fix a single file's encoding
async function fixFileEncoding(filePath) {
  try {
    console.log(`Fixing encoding for: ${filePath}`);
    
    // Read the file as a UTF-8 string
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      // If UTF-8 reading fails, try reading as binary
      content = fs.readFileSync(filePath, 'binary');
    }
    
    // Fix common import patterns for NestJS and related libraries
    if (content.includes('import') && content.includes('from')) {
      // Fix @nestjs/mapped-types imports
      if (content.includes('mapped-types')) {
        content = content.replace(
          /import\s*{[^}]*}\s*from\s*['"]@nestjs\/mapped-types['"]/g,
          "import { PartialType } from '@nestjs/mapped-types'"
        );
      }
      
      // Fix @nestjs/swagger imports
      if (content.includes('swagger')) {
        content = content.replace(
          /import\s*{[^}]*}\s*from\s*['"]@nestjs\/swagger['"]/g,
          "import { ApiProperty } from '@nestjs/swagger'"
        );
      }
      
      // Fix class-validator imports
      if (content.includes('class-validator')) {
        content = content.replace(
          /import\s*{[^}]*}\s*from\s*['"]class-validator['"]/g,
          "import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty } from 'class-validator'"
        );
      }
    }
    
    // Replace any invalid characters
    content = content.replace(/[^\x20-\x7E\r\n\t]/g, '');
    
    // Write the file back with UTF-8 encoding
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error fixing ${filePath}: ${error.message}`);
    return false;
  }
}

// Function to recursively walk through directories
function walkDir(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .git directories
      if (item !== 'node_modules' && item !== '.git') {
        files.push(...walkDir(fullPath));
      }
    } else if (stat.isFile()) {
      // Only include TypeScript files
      if (item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// Main function to fix all files
async function fixAllFiles() {
  try {
    console.log('Starting to fix encoding for all TypeScript files in the project...');
    
    // Get all .ts files in the project
    const rootDir = '.';
    const tsFiles = walkDir(rootDir);
    console.log(`Found ${tsFiles.length} TypeScript files to process.`);
    
    // Fix encoding for each file
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const file of tsFiles) {
      try {
        const success = await fixFileEncoding(file);
        if (success) {
          fixedCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error processing ${file}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('======= Encoding Fix Summary =======');
    console.log(`Total files processed: ${tsFiles.length}`);
    console.log(`Successfully fixed: ${fixedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
    console.log('====================================');
    
  } catch (error) {
    console.error(`Error fixing files: ${error.message}`);
  }
}

// Run the main function
fixAllFiles().then(() => {
  console.log('Encoding fix process completed!');
}).catch(error => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
}); 