const fs = require('fs');
const path = require('path');

// Files that need to be fixed for duplicate imports
const filesToFix = [
  'src/modules/chat/widgets.controller.ts',
  'src/modules/phone-sms/phone-sms.controller.ts',
  'src/modules/reviews/reviews.controller.ts',
  'src/modules/shop/shop.controller.ts',
  'src/modules/reviews/reviews-embed.controller.ts',
  'src/modules/shop/shop-embed.controller.ts'
];

// Function to fix duplicate imports in a file
function fixDuplicateImports(filePath) {
  try {
    console.log(`Processing file: ${filePath}`);
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix duplicate imports by keeping only the first import statement
    // and removing subsequent common imports
    let lines = content.split('\n');
    let importsSeen = new Set();
    let newLines = [];
    
    // First pass: collect all imports
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('import {')) {
        // Extract the import source (the part after 'from')
        const importMatch = line.match(/from\s+['"]([^'"]+)['"]/);
        if (importMatch) {
          const importSource = importMatch[1];
          
          // If we've already seen this import source, skip this line
          if (importsSeen.has(importSource)) {
            continue;
          }
          
          importsSeen.add(importSource);
        }
      }
      
      newLines.push(line);
    }
    
    // Fix specific issues with '-embed' imports
    let newContent = newLines.join('\n');
    
    if (filePath.includes('forms-embed.controller.ts')) {
      newContent = newContent.replace(/Forms-embedService/g, 'FormsEmbedService');
      newContent = newContent.replace(/'\.\/forms-embed\.service'/g, "'./forms-embed.service'");
    }
    
    if (filePath.includes('shop-embed.controller.ts')) {
      newContent = newContent.replace(/Shop-embedService/g, 'ShopEmbedService');
      newContent = newContent.replace(/'\.\/shop-embed\.service'/g, "'./shop-embed.service'");
    }
    
    if (filePath.includes('reviews-embed.controller.ts')) {
      newContent = newContent.replace(/Reviews-embedService/g, 'ReviewsEmbedService');
      newContent = newContent.replace(/'\.\/reviews-embed\.service'/g, "'./reviews-embed.service'");
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed duplicate imports in: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Process each file
console.log('Starting to fix duplicate imports...');
filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    fixDuplicateImports(filePath);
  } else {
    console.error(`File not found: ${filePath}`);
  }
});
console.log('Duplicate imports fix completed!'); 