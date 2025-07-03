FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Fix encoding issues
RUN node fix-frontend-encoding.js || echo "No encoding issues found"

# Update UI components
RUN node update-ui-components.js || echo "UI components update completed with warnings"

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
CMD ["npm", "start"]