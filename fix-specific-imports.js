const fs = require('fs');
const path = require('path');

// File paths to fix
const filesToFix = [
  'backend/src/modules/payment/dto/update-invoice.dto.ts',
  'backend/src/modules/payment/dto/update-payment.dto.ts',
  'backend/src/modules/payment/dto/update-payment-method.dto.ts',
  'backend/src/modules/payment/dto/update-plan.dto.ts',
  'backend/src/modules/payment/dto/update-subscription.dto.ts',
  'backend/src/modules/payment/payment.controller.ts'
];

// Main function to fix imports in specific files
function fixSpecificFiles() {
  console.log('Fixing imports for specific files...');
  
  for (const filePath of filesToFix) {
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        continue;
      }
      
      console.log(`Fixing imports for: ${filePath}`);
      
      // Read the file
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Add appropriate imports based on file type
      if (filePath.includes('update-') && filePath.includes('.dto.ts')) {
        // For update DTOs
        content = `import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsArray, IsEnum, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

${content.replace(/^import.*from.*$/gm, '')}`;
      } else if (filePath.includes('controller.ts')) {
        // For controllers
        content = `import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

${content.replace(/^import.*from.*$/gm, '')}`;
      }
      
      // Write the file back
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports for: ${filePath}`);
    } catch (error) {
      console.error(`Error fixing imports for ${filePath}: ${error.message}`);
    }
  }
  
  console.log('Done fixing specific files.');
}

// Run the main function
fixSpecificFiles(); 