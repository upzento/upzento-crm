const fs = require('fs');
const path = require('path');

// Function to fix a single file's swagger imports
function fixSwaggerImports(filePath) {
  try {
    console.log(`Fixing swagger imports for: ${filePath}`);
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file contains swagger decorators but missing imports
    if ((content.includes('@ApiTags') || 
         content.includes('@ApiOperation') || 
         content.includes('@ApiResponse') || 
         content.includes('@ApiProperty') || 
         content.includes('@ApiBearerAuth') || 
         content.includes('@ApiQuery') || 
         content.includes('@ApiParam')) && 
        !content.includes("from '@nestjs/swagger'")) {
      
      // Add the import if needed
      const importLine = "import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';\n";
      
      // Find import section
      const importSection = content.match(/import.*from.*;(\r?\n|$)*/g);
      
      if (importSection && importSection.length > 0) {
        // Add swagger import after the last import
        const lastImport = importSection[importSection.length - 1];
        const insertPosition = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertPosition) + importLine + content.slice(insertPosition);
      } else {
        // No imports found, add at the beginning
        content = importLine + content;
      }
      
      // Write the file back
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed swagger imports for: ${filePath}`);
      return true;
    } else {
      console.log(`No swagger import fixes needed for: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error fixing swagger imports for ${filePath}: ${error.message}`);
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
      if (item !== 'node_modules' && item !== '.git' && item !== 'dist') {
        files.push(...walkDir(fullPath));
      }
    } else if (stat.isFile()) {
      // Only include TypeScript files that might contain controllers
      if (item.endsWith('.controller.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// Main function
function fixAllControllers() {
  try {
    console.log('Starting to fix swagger imports for all controller files...');
    
    // Get all controller files
    const rootDir = './backend/src';
    const controllerFiles = walkDir(rootDir);
    console.log(`Found ${controllerFiles.length} controller files to process.`);
    
    // Fix swagger imports for each file
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const file of controllerFiles) {
      try {
        const success = fixSwaggerImports(file);
        if (success) {
          fixedCount++;
        }
      } catch (error) {
        console.error(`Error processing ${file}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('======= Swagger Import Fix Summary =======');
    console.log(`Total files processed: ${controllerFiles.length}`);
    console.log(`Successfully fixed: ${fixedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
    console.log('=========================================');
    
  } catch (error) {
    console.error(`Error fixing files: ${error.message}`);
  }
}

// Run the main function
fixAllControllers(); 