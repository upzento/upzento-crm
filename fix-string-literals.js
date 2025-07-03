const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'backend/src/main.ts',
  'backend/src/modules/analytics/analytics.service.ts'
];

// Function to fix string literals in a file
function fixStringLiterals(filePath) {
  try {
    console.log(`Processing file: ${filePath}`);
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix specific patterns
    if (filePath.endsWith('main.ts')) {
      content = content.replace(
        /console\.log\(Application is running on port \)/g,
        'console.log(`Application is running on port ${port}`)'
      );
    } else if (filePath.endsWith('analytics.service.ts')) {
      // Fix error messages with IDs
      content = content.replace(
        /throw new NotFoundException\(Integration with ID\s+not found\)/g,
        'throw new NotFoundException(`Integration with ID ${id} not found`)'
      );
      
      content = content.replace(
        /throw new NotFoundException\(Dashboard with ID\s+not found\)/g,
        'throw new NotFoundException(`Dashboard with ID ${id} not found`)'
      );
      
      content = content.replace(
        /throw new NotFoundException\(Widget with ID\s+not found\)/g,
        'throw new NotFoundException(`Widget with ID ${id} not found`)'
      );
      
      content = content.replace(
        /throw new NotFoundException\(Dataset with ID\s+not found\)/g,
        'throw new NotFoundException(`Dataset with ID ${id} not found`)'
      );
      
      content = content.replace(
        /throw new NotFoundException\(Report with ID\s+not found\)/g,
        'throw new NotFoundException(`Report with ID ${id} not found`)'
      );
      
      // Fix success messages
      content = content.replace(
        /message: Integration\s+synced successfully,/g,
        'message: `Integration ${id} synced successfully`,'
      );
      
      content = content.replace(
        /message: Dataset\s+refreshed successfully,/g,
        'message: `Dataset ${id} refreshed successfully`,'
      );
      
      content = content.replace(
        /message: Report\s+generated and sent successfully,/g,
        'message: `Report ${id} generated and sent successfully`,'
      );
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed string literals in: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Process each file
console.log('Starting to fix string literals...');
filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    fixStringLiterals(filePath);
  } else {
    console.error(`File not found: ${filePath}`);
  }
});
console.log('String literal fixes completed!'); 