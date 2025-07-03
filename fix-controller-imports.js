const fs = require('fs');
const path = require('path');

// Import statement to add to controllers
const CONTROLLER_IMPORTS = `import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseUUIDPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';
import { RequiresTenantType } from '../auth/decorators/tenant-type.decorator';
`;

// Find all controller files recursively in a directory
function findControllerFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findControllerFiles(filePath, fileList);
    } else if (file.endsWith('.controller.ts')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Main function to add imports to all controller files
function addImportsToFiles() {
  const basePath = path.resolve('backend/src/modules');
  
  // Find all controller files in the modules directory
  const controllerFiles = findControllerFiles(basePath);
  
  console.log(`Found ${controllerFiles.length} controller files to process`);
  
  controllerFiles.forEach(fullPath => {
    try {
      // Read file content
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Get the service name for this controller (based on file name)
      const fileName = path.basename(fullPath, '.controller.ts');
      const serviceName = fileName.charAt(0).toUpperCase() + fileName.slice(1) + 'Service';
      
      // Skip import additions if they're already there
      if (content.includes('from \'@nestjs/swagger\'') && 
          content.includes('from \'@nestjs/common\'') &&
          content.includes('JwtAuthGuard')) {
        console.log(`Skipping ${path.relative(basePath, fullPath)} - already has imports`);
        return;
      }
      
      // Remove existing imports that might conflict
      content = content.replace(/^import.*from.*nestjs\/swagger.*$/gm, '');
      content = content.replace(/^import.*from.*nestjs\/common.*$/gm, '');
      content = content.replace(/^import.*from.*auth\/guards.*$/gm, '');
      
      // Get the directory-specific service import path
      const dirName = path.dirname(fullPath).split(path.sep).pop();
      const serviceImport = `import { ${serviceName} } from './${fileName}.service';\n`;
      
      // Add imports at the beginning of the file
      const newContent = CONTROLLER_IMPORTS + serviceImport + content;
      
      // Write updated content
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`Added imports to ${path.relative(basePath, fullPath)}`);
    } catch (error) {
      console.error(`Error processing ${path.relative(basePath, fullPath)}: ${error}`);
    }
  });
}

// Run the function
console.log('Starting controller import fix...');
addImportsToFiles();
console.log('Controller import fix completed!'); 