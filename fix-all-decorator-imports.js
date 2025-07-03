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
    
    // Skip if the file doesn't exist
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return false;
    }
    
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

// Function to walk through directories
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
      // Only include TypeScript files that are controllers or DTOs
      if (item.endsWith('.ts') && (item.includes('.controller.') || item.includes('.dto.'))) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// Main function
function fixAllFiles() {
  try {
    console.log('Starting to fix imports for all controller and DTO files...');
    
    // Get all relevant files
    const rootDir = './src';
    const files = walkDir(rootDir);
    console.log(`Found ${files.length} files to process.`);
    
    // Process each file
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      try {
        const success = fixFile(file);
        if (success) {
          fixedCount++;
        }
      } catch (error) {
        console.error(`Error processing ${file}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('======= Import Fix Summary =======');
    console.log(`Total files processed: ${files.length}`);
    console.log(`Successfully fixed: ${fixedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
    console.log('==================================');
    
  } catch (error) {
    console.error(`Error fixing files: ${error.message}`);
  }
}

// Run the main function
fixAllFiles(); 