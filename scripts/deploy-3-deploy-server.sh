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
# Note: PostgreSQL, Redis, and MinIO are already running on the host server

services:
  # Backend API - Using pre-built image
  backend:
    image: \${BACKEND_IMAGE}
    container_name: tazagroup-backend
    restart: unless-stopped
    network_mode: host
    env_file:
      - .env
    environment:
      NODE_ENV: production
      PORT: 13001
      DOMAIN: tazagroup.vn
      SSL_EMAIL: admin@tazagroup.vn
      DATABASE_URL: postgresql://postgres:postgres@127.0.0.1:12003/tazagroupcore
      DOCKER_REDIS_HOST: 127.0.0.1
      DOCKER_REDIS_PORT: 12004
      DOCKER_MINIO_ENDPOINT: 127.0.0.1
      DOCKER_MINIO_PORT: 12007
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
    network_mode: host
    environment:
      NODE_ENV: production
      PORT: 13000
      NEXT_OTEL_ENABLED: \"false\"
      NEXT_TELEMETRY_DISABLED: \"1\"
      NEXT_PUBLIC_APP_URL: http://116.118.49.243:13000
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: https://appapi.tazagroup.vn/graphql
    depends_on:
      - backend
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
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
