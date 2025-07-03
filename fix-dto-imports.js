const fs = require('fs');
const path = require('path');

// Function to fix a single file's DTO imports
function fixDtoImports(filePath) {
  try {
    console.log(`Fixing DTO imports for: ${filePath}`);
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file contains validation decorators but missing imports
    if ((content.includes('@IsString') || 
         content.includes('@IsNumber') || 
         content.includes('@IsOptional') || 
         content.includes('@IsNotEmpty') || 
         content.includes('@IsBoolean') || 
         content.includes('@IsArray') || 
         content.includes('@IsEmail') || 
         content.includes('@IsEnum') ||
         content.includes('@IsDate')) && 
        !content.includes("from 'class-validator'")) {
      
      // Add the import if needed
      const validatorImport = "import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsEmail, IsNotEmpty } from 'class-validator';\n";
      
      // Find import section
      const importSection = content.match(/import.*from.*;(\r?\n|$)*/g);
      
      if (importSection && importSection.length > 0) {
        // Add validator import after the last import
        const lastImport = importSection[importSection.length - 1];
        const insertPosition = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertPosition) + validatorImport + content.slice(insertPosition);
      } else {
        // No imports found, add at the beginning
        content = validatorImport + content;
      }
      
      modified = true;
    }
    
    // Check if file contains PartialType but missing import
    if (content.includes('PartialType') && !content.includes("from '@nestjs/mapped-types'")) {
      // Add the import if needed
      const partialTypeImport = "import { PartialType } from '@nestjs/mapped-types';\n";
      
      // Find import section
      const importSection = content.match(/import.*from.*;(\r?\n|$)*/g);
      
      if (importSection && importSection.length > 0) {
        // Add PartialType import after the last import or after the class-validator import we just added
        const lastImport = importSection[importSection.length - 1];
        const insertPosition = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertPosition) + partialTypeImport + content.slice(insertPosition);
      } else {
        // No imports found, add at the beginning
        content = partialTypeImport + content;
      }
      
      modified = true;
    }
    
    // Check if file contains ApiProperty but missing import
    if (content.includes('@ApiProperty') && !content.includes("from '@nestjs/swagger'")) {
      // Add the import if needed
      const swaggerImport = "import { ApiProperty } from '@nestjs/swagger';\n";
      
      // Find import section
      const importSection = content.match(/import.*from.*;(\r?\n|$)*/g);
      
      if (importSection && importSection.length > 0) {
        // Add swagger import after the last import
        const lastImport = importSection[importSection.length - 1];
        const insertPosition = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertPosition) + swaggerImport + content.slice(insertPosition);
      } else {
        // No imports found, add at the beginning
        content = swaggerImport + content;
      }
      
      modified = true;
    }
    
    if (modified) {
      // Write the file back
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed DTO imports for: ${filePath}`);
      return true;
    } else {
      console.log(`No DTO import fixes needed for: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error fixing DTO imports for ${filePath}: ${error.message}`);
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
      // Only include TypeScript files that might be DTOs
      if ((item.includes('.dto.ts') || item.includes('dto.ts')) && !item.endsWith('.d.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// Main function
function fixAllDtos() {
  try {
    console.log('Starting to fix DTO imports for all DTO files...');
    
    // Get all DTO files
    const rootDir = './backend/src';
    const dtoFiles = walkDir(rootDir);
    console.log(`Found ${dtoFiles.length} DTO files to process.`);
    
    // Fix DTO imports for each file
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const file of dtoFiles) {
      try {
        const success = fixDtoImports(file);
        if (success) {
          fixedCount++;
        }
      } catch (error) {
        console.error(`Error processing ${file}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('======= DTO Import Fix Summary =======');
    console.log(`Total files processed: ${dtoFiles.length}`);
    console.log(`Successfully fixed: ${fixedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
    console.log('======================================');
    
  } catch (error) {
    console.error(`Error fixing files: ${error.message}`);
  }
}

// Run the main function
fixAllDtos(); 