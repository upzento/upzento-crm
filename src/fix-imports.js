const fs = require('fs');
const path = require('path');

// Define common imports needed across different file types
const commonImports = {
  controllers: `import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
`,

  dtos: `import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsObject, IsEmail, IsNotEmpty, 
  IsUUID, IsInt, Min, Max, MinLength, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
`
};

// Function to fix a single file
function fixFile(filePath) {
  try {
    console.log(`Processing file: ${filePath}`);
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Determine file type based on its path and name
    const isController = filePath.includes('.controller.ts');
    const isDto = filePath.includes('.dto.ts');
    
    // Remove existing imports that might conflict
    let cleanedContent = content.replace(/^import.*from.*nestjs\/swagger.*$/gm, '');
    cleanedContent = cleanedContent.replace(/^import.*from.*class-validator.*$/gm, '');
    cleanedContent = cleanedContent.replace(/^import.*from.*class-transformer.*$/gm, '');
    cleanedContent = cleanedContent.replace(/^import.*from.*nestjs\/mapped-types.*$/gm, '');
    
    // Add appropriate imports based on file type
    let newContent;
    if (isController) {
      newContent = commonImports.controllers + cleanedContent;
    } else if (isDto) {
      newContent = commonImports.dtos + cleanedContent;
    } else {
      // For other files, keep content as is
      newContent = content;
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed imports in: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return false;
  }
}

// Get all files in the modules directory
const moduleDir = path.join(__dirname, 'modules');
if (!fs.existsSync(moduleDir)) {
  console.error(`Module directory not found: ${moduleDir}`);
  process.exit(1);
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Process subdirectories
      fixedCount += processDirectory(fullPath);
    } else if (stat.isFile() && (item.includes('.controller.ts') || item.includes('.dto.ts'))) {
      // Process controller and DTO files
      if (fixFile(fullPath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

console.log('Starting to fix imports for controller and DTO files...');
const totalFixed = processDirectory(moduleDir);
console.log(`Successfully fixed imports in ${totalFixed} files.`); 