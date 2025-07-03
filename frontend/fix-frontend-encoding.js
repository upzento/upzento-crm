const fs = require('fs');
const path = require('path');

// Function to check if a file is UTF-16LE encoded
function isUtf16le(buffer) {
  // Check for UTF-16LE BOM (FF FE)
  if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
    return true;
  }
  
  // Check for high frequency of null bytes in even positions (characteristic of UTF-16LE)
  let nullCount = 0;
  for (let i = 0; i < Math.min(buffer.length, 100); i += 2) {
    if (buffer[i] === 0x00) {
      nullCount++;
    }
  }
  
  return nullCount > 10; // Arbitrary threshold
}

// Function to convert a file from UTF-16LE to UTF-8
function convertToUtf8(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    if (isUtf16le(buffer)) {
      console.log(`Converting ${filePath} from UTF-16LE to UTF-8`);
      // Simple conversion by removing null bytes (works for ASCII text)
      let content = '';
      for (let i = 0; i < buffer.length; i += 2) {
        if (i + 1 < buffer.length) {
          content += String.fromCharCode(buffer[i + 1]);
        }
      }
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to walk through directories recursively
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Main function
function main() {
  console.log('Scanning for UTF-16LE files...');
  
  const srcDir = path.join(__dirname, 'src');
  let convertedCount = 0;
  
  walkDir(srcDir, (filePath) => {
    // Only process TypeScript/JavaScript/TSX/JSX files
    if (/\.(ts|js|tsx|jsx)$/.test(filePath)) {
      if (convertToUtf8(filePath)) {
        convertedCount++;
      }
    }
  });
  
  console.log(`Converted ${convertedCount} files from UTF-16LE to UTF-8`);
}

// Run the main function
main();
