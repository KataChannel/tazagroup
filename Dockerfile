# Use the official BunJS image
FROM oven/bun:latest AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lock to cache dependencies
COPY package.json bun.lock ./

# Install dependencies using Bun
RUN bun install --no-cache

# Copy the entire source code into the container
COPY . .

# # Build the application
# RUN bun run build

# # Install Prisma globally and run migrations
RUN bun install -g prisma
RUN bun prisma migrate dev --name rau2.1.1
RUN bun prisma generate

# Use a smaller runtime image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy the build artifacts from the builder stage
COPY --from=builder /app /app

# Copy only necessary files
COPY --from=builder /app/dist /app/dist
COPY .env .env

# Expose the ports used by the NestJS application (e.g., 3000)
EXPOSE 3331

# Run the application
CMD ["bun", "run", "dist/src/main.js"]
