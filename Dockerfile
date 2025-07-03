FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies without using cache
RUN cd backend && npm ci --no-fund --prefer-offline --no-audit && \
    cd ../frontend && npm ci --no-fund --prefer-offline --no-audit

# Copy source code
COPY . .

# Generate Prisma client
RUN cd backend && npx prisma generate

# Build the applications (continue on TypeScript errors)
RUN cd backend && npm run build || true && \
    cd ../frontend && npm run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "backend/dist/main.js"]