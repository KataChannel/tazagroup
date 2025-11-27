# Timonacore Development Commands

.PHONY: help install dev build clean docker-up docker-down test lint

# Default target
help:
	@echo "Timonacore Development Commands"
	@echo "============================="
	@echo "install      - Install all dependencies with Bun"
	@echo "dev          - Start development servers"
	@echo "build        - Build frontend and backend"
	@echo "test         - Run all tests"
	@echo "lint         - Run linting for all projects"
	@echo "clean        - Clean all node_modules and build files"
	@echo "docker-up    - Start all services with Docker Compose"
	@echo "docker-down  - Stop all Docker services"
	@echo "db-migrate   - Run database migrations"
	@echo "db-seed      - Seed database with sample data"
	@echo "db-studio    - Open Prisma Studio"

# Installation
install:
	@echo "Installing dependencies with Bun..."
	bun install
	cd backend && bun install
	cd frontend && bun install

# Development
dev:
	@echo "Starting development servers..."
	bun run dev

# Build
build:
	@echo "Building all projects..."
	bun run build

# Testing
test:
	@echo "Running all tests..."
	bun run test

# Linting
lint:
	@echo "Running linting..."
	bun run lint

# Cleanup
clean:
	@echo "Cleaning up..."
	bun run clean

# Docker commands
docker-up:
	@echo "Starting services with Docker Compose..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

# Database commands
db-migrate:
	@echo "Running database migrations..."
	cd backend && bunx prisma migrate dev

db-seed:
	@echo "Seeding database..."
	cd backend && bunx prisma db seed

db-studio:
	@echo "Opening Prisma Studio..."
	cd backend && bunx prisma studio
