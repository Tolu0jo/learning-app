# Stage 1: Build
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN yarn build

# Stage 2: Production
FROM node:18

# Set working directory
WORKDIR /app

# Copy only the build and node_modules from the previous stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
