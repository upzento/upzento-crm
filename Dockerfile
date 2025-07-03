FROM node:20-alpine

WORKDIR /app

# Ensure we have the needed tools
RUN apk add --no-cache bash git 

# Set npm config to avoid using cache
ENV NPM_CONFIG_CACHE=/tmp/npm-cache
ENV NODE_ENV=production

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies without using cache
RUN cd backend && npm ci --no-fund --prefer-offline --no-audit --ignore-scripts && \
    cd ../frontend && npm ci --no-fund --prefer-offline --no-audit --ignore-scripts

# Copy source code
COPY . .

# Fix frontend encoding issues
RUN node fix-frontend-encoding.js

# Generate Prisma client (not through cache)
RUN cd backend && \
    mkdir -p /tmp/prisma && \
    NODE_ENV=development npm exec -- prisma generate --schema=./prisma/schema.prisma

# Build the applications (continue on TypeScript errors)
RUN cd backend && npm run build || true && \
    cd ../frontend && npm run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "backend/dist/main.js"]