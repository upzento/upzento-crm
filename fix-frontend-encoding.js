#!/usr/bin/env node

/**
 * This script fixes encoding issues in frontend TypeScript/React files
 * by ensuring they are properly saved as UTF-8 without BOM.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// File extensions to process
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss'];

// Path to the frontend directory
const frontendDir = path.join(__dirname, 'frontend');

// Function to check if a file has a UTF-8 BOM marker
function hasUTF8BOM(buffer) {
  return buffer.length >= 3 && 
         buffer[0] === 0xEF && 
         buffer[1] === 0xBB && 
         buffer[2] === 0xBF;
}

// Function to check if a file has a UTF-16LE BOM marker (FF FE)
function hasUTF16LEBOM(buffer) {
  return buffer.length >= 2 && 
         buffer[0] === 0xFF && 
         buffer[1] === 0xFE;
}

// Function to check if a file has a UTF-16BE BOM marker (FE FF)
function hasUTF16BEBOM(buffer) {
  return buffer.length >= 2 && 
         buffer[0] === 0xFE && 
         buffer[1] === 0xFF;
}

// Function to detect encoding
function detectEncoding(buffer) {
  if (hasUTF8BOM(buffer)) {
    return 'utf8-bom';
  }
  if (hasUTF16LEBOM(buffer)) {
    return 'utf16le';
  }
  if (hasUTF16BEBOM(buffer)) {
    return 'utf16be';
  }
  
  // Try to decode as UTF-8
  try {
    buffer.toString('utf8');
    return 'utf8';
  } catch (error) {
    // If UTF-8 fails, assume it's Latin1 (Windows-1252)
    return 'latin1';
  }
}

// Function to fix file encoding
async function fixFileEncoding(filePath) {
  try {
    // Read file as buffer to check encoding
    const buffer = await readFile(filePath);
    const encoding = detectEncoding(buffer);
    
    // Only process if not already UTF-8 without BOM
    if (encoding !== 'utf8') {
      console.log(`Processing ${filePath} (detected encoding: ${encoding})`);
      
      let content;
      
      // Convert content based on detected encoding
      if (encoding === 'utf8-bom') {
        // Remove BOM (first 3 bytes) and convert to string
        content = buffer.slice(3).toString('utf8');
      } else if (encoding === 'utf16le') {
        // Remove BOM (first 2 bytes) and convert from UTF-16LE
        content = buffer.slice(2).toString('utf16le');
      } else if (encoding === 'utf16be') {
        // This is trickier - we'd need to swap byte pairs
        // For simplicity, we'll use a library or just read as utf16be
        content = buffer.toString('utf16be');
      } else {
        // For latin1 or other encodings
        content = buffer.toString('latin1');
      }
      
      // Replace any invalid characters
      content = content.replace(/[\uFFFD\uFFFE\uFFFF]/g, '');
      
      // Write back as UTF-8 without BOM
      await writeFile(filePath, content, 'utf8');
      console.log(`Fixed encoding for: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return false;
  }
}

// Function to recursively process directories
async function processDirectory(dirPath) {
  let fixedCount = 0;
  
  try {
    const entries = await readdir(dirPath);
    
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry);
      const entryStat = await stat(entryPath);
      
      if (entryStat.isDirectory()) {
        // Skip node_modules and .next directories
        if (entry !== 'node_modules' && entry !== '.next' && entry !== 'dist' && entry !== 'build') {
          fixedCount += await processDirectory(entryPath);
        }
      } else if (entryStat.isFile()) {
        const ext = path.extname(entry).toLowerCase();
        if (EXTENSIONS.includes(ext)) {
          const fixed = await fixFileEncoding(entryPath);
          if (fixed) fixedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}: ${error.message}`);
  }
  
  return fixedCount;
}

// Main function
async function main() {
  console.log('Starting frontend file encoding fix...');
  
  // Check if frontend directory exists
  try {
    await stat(frontendDir);
  } catch (error) {
    console.error(`Frontend directory not found at ${frontendDir}`);
    process.exit(1);
  }
  
  // Process all files
  const fixedCount = await processDirectory(frontendDir);
  
  console.log(`Completed! Fixed encoding for ${fixedCount} files.`);
}

// Run the script
main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
