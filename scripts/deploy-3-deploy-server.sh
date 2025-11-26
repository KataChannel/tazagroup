#!/bin/bash

# ============================================================================
# TAZAGROUP - Deploy on Server
# ============================================================================
# This script runs on the server to load images and deploy containers
# Can be executed remotely from local machine
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="${SERVER_USER:-it}"
SERVER_HOST="${SERVER_HOST:-116.118.49.243}"
SERVER_PATH="${SERVER_PATH:-/home/it/tazagroup-deploy}"
RUN_LOCALLY="${1:-false}"  # Set to "local" to execute commands on server from local machine

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🚀 TAZAGROUP - DEPLOY ON SERVER                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to execute command (locally on server or remotely)
execute_cmd() {
    if [ "$RUN_LOCALLY" = "local" ]; then
        ssh "${SERVER_USER}@${SERVER_HOST}" "cd ${SERVER_PATH} && $1"
    else
        eval "$1"
    fi
}

# ============================================================================
# STEP 1: Verify Files
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📋 STEP 1: Verifying Deployment Files...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$RUN_LOCALLY" != "local" ]; then
    # Running on server
    if [ ! -f ".docker-image-tags" ]; then
        echo -e "${RED}❌ .docker-image-tags file not found${NC}"
        exit 1
    fi
    
    source .docker-image-tags
    
    echo -e "${GREEN}✅ Found deployment files${NC}"
    echo "  Image Tag: ${IMAGE_TAG}"
else
    # Running from local, check remotely
    execute_cmd "test -f .docker-image-tags && echo 'Files OK' || echo 'Files missing'"
fi

# ============================================================================
# STEP 2: Load Backend Image
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🐳 STEP 2: Loading Backend Image...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

execute_cmd "source .docker-image-tags && echo -e '${BLUE}Loading: backend-\${IMAGE_TAG}.tar.gz${NC}'"
execute_cmd "source .docker-image-tags && docker load -i backend-\${IMAGE_TAG}.tar.gz"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend image loaded${NC}"
else
    echo -e "${RED}❌ Failed to load backend image${NC}"
    exit 1
fi

# ============================================================================
# STEP 3: Load Frontend Image
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🐳 STEP 3: Loading Frontend Image...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

execute_cmd "source .docker-image-tags && echo -e '${BLUE}Loading: frontend-\${IMAGE_TAG}.tar.gz${NC}'"
execute_cmd "source .docker-image-tags && docker load -i frontend-\${IMAGE_TAG}.tar.gz"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend image loaded${NC}"
else
    echo -e "${RED}❌ Failed to load frontend image${NC}"
    exit 1
fi

# ============================================================================
# STEP 4: Update Docker Compose
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 STEP 4: Updating Docker Compose Configuration...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Create updated docker-compose with specific image tags
execute_cmd "source .docker-image-tags && cat > docker-compose.deploy.yml << 'EOFCOMPOSE'
version: '3.8'

# TazaGroup Production Deployment
# Using pre-built images

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: tazagroup-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: tazagroupcore
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - \"13003:5432\"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - tazagroup-network
    healthcheck:
      test: [\"CMD-SHELL\", \"pg_isready -U postgres\"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  # Redis Cache
  redis:
    image: redis:7.4-alpine
    container_name: tazagroup-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --timeout 300 --maxmemory 256mb --maxmemory-policy allkeys-lru --requirepass 123456
    ports:
      - \"12004:6379\"
    volumes:
      - redis_data:/data
    networks:
      - tazagroup-network
    healthcheck:
      test: [\"CMD\", \"redis-cli\", \"--raw\", \"incr\", \"ping\"]
      interval: 30s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M

  # MinIO Object Storage
  minio:
    image: minio/minio:RELEASE.2024-08-26T15-33-07Z
    container_name: tazagroup-minio
    restart: unless-stopped
    environment:
      MINIO_ROOT_USER: minio-admin
      MINIO_ROOT_PASSWORD: minio-secret-2025
    ports:
      - \"12007:9000\"
      - \"12008:9001\"
    volumes:
      - minio_data:/data
    command: server /data --console-address \":9001\"
    networks:
      - tazagroup-network
    healthcheck:
      test: [\"CMD\", \"mc\", \"ready\", \"local\"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M

  # Backend API - Using pre-built image
  backend:
    image: \${BACKEND_IMAGE}
    container_name: tazagroup-backend
    restart: unless-stopped
    env_file:
      - .env
    environment:
      NODE_ENV: production
      PORT: 4000
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/tazagroupcore
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: 123456
      MINIO_ENDPOINT: minio
      MINIO_PORT: 9000
      MINIO_USE_SSL: \"false\"
      MINIO_ACCESS_KEY: minio-admin
      MINIO_SECRET_KEY: minio-secret-2025
      MINIO_BUCKET_NAME: tazagroup-uploads
    ports:
      - \"13001:4000\"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      minio:
        condition: service_healthy
    networks:
      - tazagroup-network
    deploy:
      resources:
        limits:
          memory: 768M
        reservations:
          memory: 512M

  # Frontend Application - Using pre-built image
  frontend:
    image: \${FRONTEND_IMAGE}
    container_name: tazagroup-frontend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      NEXT_OTEL_ENABLED: \"false\"
      NEXT_TELEMETRY_DISABLED: \"1\"
      NEXT_PUBLIC_APP_URL: http://116.118.49.243:13000
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: https://appapi.tazagroup.vn/graphql
    ports:
      - \"13000:3000\"
    depends_on:
      - backend
    networks:
      - tazagroup-network
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  minio_data:
    driver: local

networks:
  tazagroup-network:
    driver: bridge
    name: tazagroup-network
EOFCOMPOSE
"

echo -e "${GREEN}✅ Docker Compose configuration updated${NC}"

# ============================================================================
# STEP 5: Stop Old Containers
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🛑 STEP 5: Stopping Old Containers...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

execute_cmd "docker-compose -f docker-compose.deploy.yml down || true"
echo -e "${GREEN}✅ Old containers stopped${NC}"

# ============================================================================
# STEP 6: Start New Containers
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🚀 STEP 6: Starting New Containers...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

execute_cmd "source .docker-image-tags && export BACKEND_IMAGE=\${BACKEND_IMAGE} FRONTEND_IMAGE=\${FRONTEND_IMAGE} && docker-compose -f docker-compose.deploy.yml up -d"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Containers started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start containers${NC}"
    exit 1
fi

# ============================================================================
# STEP 7: Verify Deployment
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}✅ STEP 7: Verifying Deployment...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

sleep 5

echo -e "${BLUE}📊 Container Status:${NC}"
execute_cmd "docker-compose -f docker-compose.deploy.yml ps"

echo ""
echo -e "${BLUE}🏥 Health Checks:${NC}"
execute_cmd "docker ps --filter 'name=tazagroup' --format 'table {{.Names}}\t{{.Status}}'"

# ============================================================================
# Summary
# ============================================================================
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETED SUCCESSFULLY${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}🌐 Access URLs:${NC}"
echo "  Frontend:  http://116.118.49.243:13000"
echo "  Backend:   http://116.118.49.243:13001"
echo "  GraphQL:   http://116.118.49.243:13001/graphql"
echo ""
echo -e "${YELLOW}📝 Useful Commands:${NC}"
echo "  View logs:    docker-compose -f docker-compose.deploy.yml logs -f"
echo "  Stop all:     docker-compose -f docker-compose.deploy.yml down"
echo "  Restart:      docker-compose -f docker-compose.deploy.yml restart"
echo ""
echo -e "${GREEN}🎉 TazaGroup is now running!${NC}"
echo ""
