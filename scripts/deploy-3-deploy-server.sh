#!/bin/bash

# ============================================================================
# TAZAGROUP - Deploy on Server
# ============================================================================
# This script loads Docker images and deploys containers on server
# Can be executed remotely from local machine
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-116.118.49.243}"
SERVER_PATH="${SERVER_PATH:-/root/tazagroup}"
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
        cd ${SERVER_PATH}
        eval "$1"
    fi
}

# ============================================================================
# STEP 1: Find Image Files
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📋 STEP 1: Finding Image Files...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

execute_cmd "
BACKEND_TAR=\$(ls -t backend-*.tar.gz 2>/dev/null | head -1)
FRONTEND_TAR=\$(ls -t frontend-*.tar.gz 2>/dev/null | head -1)

if [ -z \"\$BACKEND_TAR\" ] || [ -z \"\$FRONTEND_TAR\" ]; then
    echo -e \"${RED}❌ Image files not found${NC}\"
    exit 1
fi

echo -e \"${GREEN}✅ Found image files:${NC}\"
echo \"  Backend:  \$BACKEND_TAR\"
echo \"  Frontend: \$FRONTEND_TAR\"
"

# ============================================================================
# STEP 2: Load Backend Image
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🐳 STEP 2: Loading Backend Image...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

execute_cmd "
BACKEND_TAR=\$(ls -t backend-*.tar.gz 2>/dev/null | head -1)
echo -e \"${BLUE}Loading: \$BACKEND_TAR${NC}\"
gunzip -c \"\$BACKEND_TAR\" | docker load
"

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

execute_cmd "
FRONTEND_TAR=\$(ls -t frontend-*.tar.gz 2>/dev/null | head -1)
echo -e \"${BLUE}Loading: \$FRONTEND_TAR${NC}\"
gunzip -c \"\$FRONTEND_TAR\" | docker load
"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend image loaded${NC}"
else
    echo -e "${RED}❌ Failed to load frontend image${NC}"
    exit 1
fi

# ============================================================================
# STEP 4: Deploy with Docker Compose
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🚀 STEP 4: Deploying with Docker Compose...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Stop and remove old backend/frontend containers
execute_cmd "docker stop tazagroup-backend tazagroup-frontend 2>/dev/null || true"
execute_cmd "docker rm tazagroup-backend tazagroup-frontend 2>/dev/null || true"

# Get the loaded image names and start containers
execute_cmd "
BACKEND_IMG=\$(docker images --format '{{.Repository}}:{{.Tag}}' | grep 'tazagroup.*backend' | head -1)
FRONTEND_IMG=\$(docker images --format '{{.Repository}}:{{.Tag}}' | grep 'tazagroup.*frontend' | head -1)

echo -e \"${CYAN}Starting backend with image: \$BACKEND_IMG${NC}\"
docker run -d --name tazagroup-backend \\
  --restart unless-stopped \\
  --network host \\
  -e NODE_ENV=production \\
  -e PORT=13001 \\
  -e DOCKER_NETWORK_NAME=host \\
  -e DOCKER_REDIS_HOST=127.0.0.1 \\
  -e DOCKER_REDIS_PORT=12004 \\
  -e DOCKER_MINIO_ENDPOINT=127.0.0.1 \\
  -e DOCKER_MINIO_PORT=12007 \\
  -e DOMAIN=tazagroup.vn \\
  -e SSL_EMAIL=admin@tazagroup.vn \\
  -e FRONTEND_URL=https://app.tazagroup.vn \\
  -e DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:12003/tazagroupcore' \\
  -e MINIO_INTERNAL_ENDPOINT=127.0.0.1 \\
  -e MINIO_INTERNAL_PORT=12007 \\
  -e MINIO_INTERNAL_SSL=false \\
  -e MINIO_ENDPOINT=storage.tazagroup.vn \\
  -e MINIO_PORT=443 \\
  -e MINIO_PUBLIC_ENDPOINT=storage.tazagroup.vn \\
  -e MINIO_USE_SSL=false \\
  -e MINIO_ACCESS_KEY=minio-admin \\
  -e MINIO_SECRET_KEY=minio-secret-2025 \\
  -e MINIO_BUCKET_NAME=tazagroup-uploads \\
  -e JWT_SECRET=\${JWT_SECRET} \\
  -e JWT_EXPIRES_IN=7d \\
  -e NEXTAUTH_SECRET=\${NEXTAUTH_SECRET} \\
  -e NEXTAUTH_URL=https://app.tazagroup.vn \\
  -e GOOGLE_CLIENT_ID=\${GOOGLE_CLIENT_ID} \\
  -e GOOGLE_CLIENT_SECRET=\${GOOGLE_CLIENT_SECRET} \\
  \$BACKEND_IMG

echo -e \"${CYAN}Starting frontend with image: \$FRONTEND_IMG${NC}\"
docker run -d --name tazagroup-frontend \\
  --restart unless-stopped \\
  --network host \\
  -e NODE_ENV=production \\
  -e PORT=13000 \\
  -e NEXT_PUBLIC_API_URL=https://appapi.tazagroup.vn \\
  -e NEXT_PUBLIC_WS_URL=wss://appapi.tazagroup.vn \\
  -e NEXT_PUBLIC_GRAPHQL_URL=https://appapi.tazagroup.vn/graphql \\
  -e NEXT_PUBLIC_GRAPHQL_WS_URL=wss://appapi.tazagroup.vn/graphql \\
  -e NEXT_PUBLIC_STORAGE_URL=https://storage.tazagroup.vn \\
  -e NEXTAUTH_URL=https://app.tazagroup.vn \\
  -e NEXTAUTH_SECRET=\${NEXTAUTH_SECRET} \\
  -e GOOGLE_CLIENT_ID=\${GOOGLE_CLIENT_ID} \\
  -e GOOGLE_CLIENT_SECRET=\${GOOGLE_CLIENT_SECRET} \\
  \$FRONTEND_IMG
"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Containers started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start containers${NC}"
    exit 1
fi

# Wait for services to be ready
echo ""
echo -e "${CYAN}⏳ Waiting for services to be ready...${NC}"
sleep 10

# ============================================================================
# STEP 5: Verify Deployment
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}✅ STEP 5: Verifying Deployment...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${BLUE}📊 Container Status:${NC}"
execute_cmd "docker compose ps"

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
echo "  Frontend:  https://app.tazagroup.vn"
echo "  Backend:   https://appapi.tazagroup.vn"
echo "  GraphQL:   https://appapi.tazagroup.vn/graphql"
echo ""
echo -e "${YELLOW}📝 Useful Commands:${NC}"
echo "  View logs:    docker compose logs -f"
echo "  Stop all:     docker compose down"
echo "  Restart:      docker compose restart"
echo ""
echo -e "${GREEN}🎉 TazaGroup is now running!${NC}"
echo ""
