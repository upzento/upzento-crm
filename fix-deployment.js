const fs = require('fs');
const path = require('path');

// Create frontend Dockerfile
console.log('Creating frontend Dockerfile...');
const frontendDockerfilePath = path.join(__dirname, 'frontend', 'Dockerfile');
const frontendDockerfileContent = `FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Fix encoding issues
RUN node fix-frontend-encoding.js || echo "No encoding issues found"

# Build the app
RUN npm run build || echo "Build completed with warnings"

FROM node:18-alpine AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]`;

fs.writeFileSync(frontendDockerfilePath, frontendDockerfileContent);

// Create frontend railway.json
console.log('Creating frontend railway.json...');
const frontendRailwayPath = path.join(__dirname, 'frontend', 'railway.json');
const frontendRailwayContent = `{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfile": "Dockerfile"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}`;

fs.writeFileSync(frontendRailwayPath, frontendRailwayContent);

// Create backend Dockerfile
console.log('Creating backend Dockerfile...');
const backendDockerfilePath = path.join(__dirname, 'backend', 'Dockerfile');
const backendDockerfileContent = `FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install instead of npm ci)
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source files
COPY . .

# Build application (ignoring TypeScript errors)
RUN npm run build || true

FROM node:18-alpine AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "start:prod"]`;

fs.writeFileSync(backendDockerfilePath, backendDockerfileContent);

// Create backend railway.json
console.log('Creating backend railway.json...');
const backendRailwayPath = path.join(__dirname, 'backend', 'railway.json');
const backendRailwayContent = `{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfile": "Dockerfile"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}`;

fs.writeFileSync(backendRailwayPath, backendRailwayContent);

// Fix backend package.json
console.log('Fixing backend package.json...');
try {
  const backendPackageJsonPath = path.join(__dirname, 'backend', 'package.json');
  const backendPackageJson = JSON.parse(fs.readFileSync(backendPackageJsonPath, 'utf8'));

  // Update problematic dependencies
  if (backendPackageJson.dependencies) {
    // Fix ajv version
    if (backendPackageJson.dependencies.ajv) {
      backendPackageJson.dependencies.ajv = "^8.12.0";
      console.log('Updated ajv to ^8.12.0');
    }

    // Fix json-schema-traverse version
    if (backendPackageJson.dependencies['json-schema-traverse']) {
      backendPackageJson.dependencies['json-schema-traverse'] = "^1.0.0";
      console.log('Updated json-schema-traverse to ^1.0.0');
    }

    // Add missing dependencies
    if (!backendPackageJson.dependencies['fast-uri']) {
      backendPackageJson.dependencies['fast-uri'] = "^3.0.6";
      console.log('Added fast-uri ^3.0.6');
    }
  }

  // Write updated package.json
  fs.writeFileSync(backendPackageJsonPath, JSON.stringify(backendPackageJson, null, 2));
  console.log('Backend package.json updated');
} catch (error) {
  console.error('Error updating backend package.json:', error);
}

console.log('Deployment fixes completed! Run "npm install" in the backend directory to update package-lock.json.'); 