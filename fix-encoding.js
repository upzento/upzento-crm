const fs = require("fs");
const path = require("path");

// Function to fix a single file
function fixFileEncoding(filePath) {
  try {
    console.log("Fixing encoding for: " + filePath);
    
    // Read the file with binary encoding
    let content = fs.readFileSync(filePath, "binary");
    
    // Replace any non-ASCII characters with their ASCII equivalents or remove them
    content = content.replace(/[^\x00-\x7F]/g, "");
    
    // Write it back with ASCII encoding
    fs.writeFileSync(filePath, content, "ascii");
    
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
