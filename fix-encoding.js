const fs = require("fs");
const path = require("path");

// Function to fix a single file
function fixFileEncoding(filePath) {
  try {
    console.log("Fixing encoding for: " + filePath);
    
    // Read the file with binary encoding
    let content = fs.readFileSync(filePath, "binary");
    
    // Clean up the content while preserving code structure
    // Instead of removing all non-ASCII, we'll replace with appropriate characters
    content = content
      // Replace common UTF-16/UTF-8 BOM and other problematic sequences
      .replace(/^\uFEFF/, '') // BOM
      .replace(/[^\x20-\x7E\r\n\t]/g, '') // Keep only printable ASCII, newlines and tabs
      .replace(/\u0000/g, ''); // Remove null bytes
    
    // Write it back with UTF-8 encoding
    fs.writeFileSync(filePath, content, "utf8");
    
    console.log("Fixed: " + filePath);
  } catch (error) {
    console.error("Error fixing " + filePath + ": " + error.message);
  }
}

// Function to walk through directories recursively
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

// Main function to fix all TypeScript files
function fixAllTsFiles(rootDir) {
  console.log("Starting to fix encoding for all TypeScript files in " + rootDir);
  
  walkDir(rootDir, (filePath) => {
    if (filePath.endsWith(".ts")) {
      fixFileEncoding(filePath);
    }
  });
  
  console.log("Finished fixing encoding for all TypeScript files");
}

// Handle direct file fix if provided as command line argument
if (process.argv.length > 2) {
  const filePath = process.argv[2];
  if (fs.existsSync(filePath)) {
    fixFileEncoding(filePath);
  } else {
    console.error("File not found: " + filePath);
  }
} else {
  // Fix files in backend directory
  fixAllTsFiles("./backend/src");
}
