const fs = require('fs');
const path = require('path');

// Read package.json
console.log('Reading package.json...');
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Update problematic dependencies
console.log('Updating dependencies...');
if (packageJson.dependencies) {
  // Fix ajv version
  if (packageJson.dependencies.ajv) {
    packageJson.dependencies.ajv = "^8.12.0";
    console.log('Updated ajv to ^8.12.0');
  }

  // Fix json-schema-traverse version
  if (packageJson.dependencies['json-schema-traverse']) {
    packageJson.dependencies['json-schema-traverse'] = "^1.0.0";
    console.log('Updated json-schema-traverse to ^1.0.0');
  }

  // Add missing dependencies
  if (!packageJson.dependencies['fast-uri']) {
    packageJson.dependencies['fast-uri'] = "^3.0.6";
    console.log('Added fast-uri ^3.0.6');
  }
}

// Write updated package.json
console.log('Writing updated package.json...');
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Done! Now run "npm install" to update package-lock.json.'); 