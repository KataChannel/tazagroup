#!/bin/bash

# Timonacore Quick Setup Script
# This script sets up the Timonacore project with Bun.js

set -e

echo "🚀 Setting up Timonacore project..."

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install Bun first:"
    echo "curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo "✅ Bun is installed"

# Install dependencies
echo "📦 Installing dependencies..."
bun install

echo "📦 Installing backend dependencies..."
cd backend && bun install

echo "📦 Installing frontend dependencies..."
cd ../frontend && bun install

cd ..

# Copy environment files
echo "🔧 Setting up environment files..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from .env.example"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Created frontend/.env.local from .env.example"
fi

# Setup database (if Docker is available)
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Starting database services..."
    docker-compose up -d postgres redis minio
    
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    echo "🗄️ Running database migrations..."
    cd backend && bunx prisma migrate dev --name init
    
    echo "🌱 Seeding database..."
    bunx prisma db seed
    
    cd ..
else
    echo "⚠️ Docker not found. Please set up PostgreSQL, Redis, and Minio manually."
    echo "Database connection string: postgresql://postgres:postgres@localhost:5432/timonacore"
fi

echo ""
echo "🎉 Timonacore setup complete!"
echo ""
echo "To start development:"
echo "  bun run dev"
echo ""
echo "To start with Docker:"
echo "  docker-compose up -d"
echo "  bun run dev"
echo ""
echo "Available commands:"
echo "  make help       - Show all available commands"
echo "  bun run dev     - Start development servers"
echo "  bun run build   - Build for production"
echo "  bun run test    - Run tests"
echo "  make db-studio  - Open Prisma Studio"
echo ""
