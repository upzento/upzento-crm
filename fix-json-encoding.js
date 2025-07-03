const fs = require("fs");
const path = require("path");

// Function to fix a single file
function fixFileEncoding(filePath) {
  try {
    console.log("Fixing encoding for: " + filePath);
    
    // Read the file with binary encoding
    const content = fs.readFileSync(filePath, "binary");
    
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

// Main function to fix all JSON files
function fixAllJsonFiles(rootDir) {
  console.log("Starting to fix encoding for all JSON files in " + rootDir);
  
  walkDir(rootDir, (filePath) => {
    if (filePath.endsWith(".json")) {
      fixFileEncoding(filePath);
    }
  });
  
  console.log("Finished fixing encoding for all JSON files");
}

// Fix files in frontend directory
fixAllJsonFiles("./frontend");
