const fs = require("fs");
const path = require("path");

// Function to fix import statements in a single file
function fixImportStatements(filePath) {
  try {
    console.log("Fixing imports in: " + filePath);
    
    // Read the file
    let content = fs.readFileSync(filePath, "utf8");
    
    // Check for and fix common import statement issues
    content = content
      // Fix 'class-validator' imports
      .replace(/import\s*\{[^}]*\}\s*from\s*['"](class-validator)['"]/g, 
               "import { IsNotEmpty, IsObject, IsOptional, IsString, IsEmail, IsBoolean, IsNumber, IsDate, IsArray, ValidateNested, IsEnum, IsUUID, IsUrl, MinLength, MaxLength, Min, Max } from 'class-validator'")
      
      // Fix '@nestjs/swagger' imports
      .replace(/import\s*\{[^}]*\}\s*from\s*['"]([@]nestjs\/swagger)['"]/g,
               "import { ApiProperty, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'")
      
      // Fix '@nestjs/common' imports
      .replace(/import\s*\{[^}]*\}\s*from\s*['"]([@]nestjs\/common)['"]/g,
               "import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Injectable, Module } from '@nestjs/common'");
    
    // Write it back
    fs.writeFileSync(filePath, content, "utf8");
    
    console.log("Fixed imports in: " + filePath);
  } catch (error) {
    console.error("Error fixing imports in " + filePath + ": " + error.message);
  }
}

// Main function to run
function main() {
  // Check if a specific file was provided
  if (process.argv.length > 2) {
    const filePath = process.argv[2];
    if (fs.existsSync(filePath)) {
      fixImportStatements(filePath);
    } else {
      console.error("File not found: " + filePath);
    }
  } else {
    console.error("Please provide a file path to fix");
  }
}

// Run the main function
main(); 