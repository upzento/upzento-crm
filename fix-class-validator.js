const fs = require('fs');
const path = require('path');

// Import statements to add to DTOs
const CLASS_VALIDATOR_IMPORT = "import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsNotEmpty, IsEmail, IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';\n";
const CLASS_TRANSFORMER_IMPORT = "import { Type } from 'class-transformer';\n";
const MAPPED_TYPES_IMPORT = "import { PartialType } from '@nestjs/mapped-types';\n";
const SWAGGER_IMPORT = "import { ApiProperty } from '@nestjs/swagger';\n";

// Find all .dto.ts files recursively in a directory
function findDtoFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findDtoFiles(filePath, fileList);
    } else if (file.endsWith('.dto.ts')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Main function to add imports to all DTO files
function addImportsToFiles() {
  const basePath = path.resolve('backend/src/modules');
  
  // Find all DTO files in the modules directory
  const dtoFiles = findDtoFiles(basePath);
  
  console.log(`Found ${dtoFiles.length} DTO files to process`);
  
  dtoFiles.forEach(fullPath => {
    try {
      // Read file content
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Skip if the file already has the imports
      if (content.includes('from \'class-validator\'') && 
          content.includes('from \'@nestjs/mapped-types\'') &&
          content.includes('from \'@nestjs/swagger\'')) {
        console.log(`Skipping ${path.relative(basePath, fullPath)} - already has imports`);
        return;
      }
      
      // Remove any existing imports for these libraries
      content = content.replace(/^import.*from.*class-validator.*$/gm, '');
      content = content.replace(/^import.*from.*class-transformer.*$/gm, '');
      content = content.replace(/^import.*from.*nestjs\/mapped-types.*$/gm, '');
      content = content.replace(/^import.*from.*nestjs\/swagger.*$/gm, '');
      
      // Add imports at the beginning of the file
      const newContent = CLASS_VALIDATOR_IMPORT + 
                        CLASS_TRANSFORMER_IMPORT + 
                        MAPPED_TYPES_IMPORT +
                        SWAGGER_IMPORT +
                        content;
      
      // Write updated content
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`Added imports to ${path.relative(basePath, fullPath)}`);
    } catch (error) {
      console.error(`Error processing ${path.relative(basePath, fullPath)}: ${error}`);
    }
  });
}

// Run the function
console.log('Starting import fix...');
addImportsToFiles();
console.log('Import fix completed!'); 