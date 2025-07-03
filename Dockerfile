FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy source code
COPY backend ./backend/

# Build the app
RUN cd backend && npx tsc || true

# Runtime stage
FROM node:20-slim

WORKDIR /app

# Copy package files and install production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app/backend/dist ./backend/dist

# Copy Prisma schema
COPY backend/prisma ./backend/prisma

# Generate Prisma client
RUN cd backend && npx prisma generate

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "backend/dist/main.js"] 