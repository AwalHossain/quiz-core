# Build stage
FROM node:16 AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including dev dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Check if dist/main.js exists
RUN ls -la dist/

# Production stage
FROM node:16-slim

WORKDIR /usr/src/app

# Install OpenSSL - Add this before other commands
RUN apt-get update -y && \
    apt-get install -y openssl libssl1.1 && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and prisma
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm install --only=production

# Generate Prisma client in production
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8000

ENV NODE_ENV=production

# Change the start command to use the correct path
CMD ["node", "dist/src/main"]