#!/bin/bash

# ============================================================================
# TAZAGROUP - Export and Copy Images to Server
# ============================================================================
# This script exports Docker images and copies them to the server via SCP
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-116.118.49.243}"
SERVER_PATH="${SERVER_PATH:-/root/tazagroup}"
TEMP_DIR="./docker-images-export"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     📦 TAZAGROUP - EXPORT & COPY IMAGES TO SERVER        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get image names from docker compose images (built images)
BACKEND_IMAGE=$(docker compose images -q backend 2>/dev/null | xargs docker inspect --format='{{index .RepoTags 0}}' 2>/dev/null | head -1)
FRONTEND_IMAGE=$(docker compose images -q frontend 2>/dev/null | xargs docker inspect --format='{{index .RepoTags 0}}' 2>/dev/null | head -1)

# Fallback: try to find by name pattern
if [ -z "$BACKEND_IMAGE" ]; then
    BACKEND_IMAGE=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "tazagroup.*backend" | grep -v "<none>" | head -1)
fi

if [ -z "$FRONTEND_IMAGE" ]; then
    FRONTEND_IMAGE=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "tazagroup.*frontend" | grep -v "<none>" | head -1)
fi

if [ -z "$BACKEND_IMAGE" ] || [ -z "$FRONTEND_IMAGE" ]; then
    echo -e "${RED}❌ Could not find backend or frontend images${NC}"
    echo -e "${YELLOW}Please run deploy-1-build-local.sh first${NC}"
    exit 1
fi

echo -e "${GREEN}📦 Images to Export:${NC}"
echo "  Backend:  ${BACKEND_IMAGE}"
echo "  Frontend: ${FRONTEND_IMAGE}"
echo ""
echo -e "${GREEN}🌐 Server Configuration:${NC}"
echo "  User: ${SERVER_USER}"
echo "  Host: ${SERVER_HOST}"
echo "  Path: ${SERVER_PATH}"
echo ""

# Create temporary directory for exports
mkdir -p "${TEMP_DIR}"

# ============================================================================
# STEP 1: Export Backend Image
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 STEP 1: Exporting Backend Image...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

BACKEND_TAR="${TEMP_DIR}/backend-${TIMESTAMP}.tar"

echo -e "${BLUE}💾 Saving image to: ${BACKEND_TAR}.gz${NC}"
docker save "${BACKEND_IMAGE}" | gzip > "${BACKEND_TAR}.gz"

if [ $? -eq 0 ]; then
    BACKEND_SIZE=$(du -h "${BACKEND_TAR}.gz" | cut -f1)
    echo -e "${GREEN}✅ Backend image exported (${BACKEND_SIZE})${NC}"
else
    echo -e "${RED}❌ Backend image export failed${NC}"
    exit 1
fi

# ============================================================================
# STEP 2: Export Frontend Image
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 STEP 2: Exporting Frontend Image...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

FRONTEND_TAR="${TEMP_DIR}/frontend-${TIMESTAMP}.tar"

echo -e "${BLUE}💾 Saving image to: ${FRONTEND_TAR}.gz${NC}"
docker save "${FRONTEND_IMAGE}" | gzip > "${FRONTEND_TAR}.gz"

if [ $? -eq 0 ]; then
    FRONTEND_SIZE=$(du -h "${FRONTEND_TAR}.gz" | cut -f1)
    echo -e "${GREEN}✅ Frontend image exported (${FRONTEND_SIZE})${NC}"
else
    echo -e "${RED}❌ Frontend image export failed${NC}"
    exit 1
fi

# ============================================================================
# STEP 3: Create deployment package
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 STEP 3: Creating Deployment Package...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Copy necessary files to temp directory
echo -e "${BLUE}📝 Copying deployment files...${NC}"
cp docker-compose.yml "${TEMP_DIR}/"
if [ -f ".env" ]; then
    cp .env "${TEMP_DIR}/"
fi

# Create deployment info file
cat > "${TEMP_DIR}/deployment-info.txt" << EOF
TAZAGROUP Deployment Package
============================
Generated: $(date)
Timestamp: ${TIMESTAMP}

Images:
  - Backend:  ${BACKEND_IMAGE} (${BACKEND_SIZE})
  - Frontend: ${FRONTEND_IMAGE} (${FRONTEND_SIZE})

Deployment:
  1. Load images: gunzip -c backend-${TIMESTAMP}.tar.gz | docker load
  2. Load images: gunzip -c frontend-${TIMESTAMP}.tar.gz | docker load
  3. Run: docker compose up -d
EOF

echo -e "${GREEN}✅ Deployment package created${NC}"

# ============================================================================
# STEP 4: Copy to Server
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🚀 STEP 4: Copying Files to Server...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${BLUE}📤 Creating server directory...${NC}"
ssh "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${SERVER_PATH}"

echo -e "${BLUE}📤 Uploading deployment package...${NC}"
echo "  This may take several minutes depending on your connection speed..."
echo ""

# Use rsync for better performance and resume capability
if command -v rsync &> /dev/null; then
    echo -e "${BLUE}Using rsync for faster transfer...${NC}"
    rsync -avz --progress "${TEMP_DIR}/" "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"
else
    echo -e "${BLUE}Using scp for transfer...${NC}"
    scp -r "${TEMP_DIR}/"* "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Files uploaded successfully${NC}"
else
    echo -e "${RED}❌ File upload failed${NC}"
    exit 1
fi

# ============================================================================
# STEP 5: Cleanup Local Files
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🧹 STEP 5: Cleaning up local files...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

read -p "$(echo -e ${YELLOW}Do you want to remove local export files? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "${TEMP_DIR}"
    echo -e "${GREEN}✅ Local export files removed${NC}"
else
    echo -e "${BLUE}ℹ️  Local export files kept in: ${TEMP_DIR}${NC}"
fi

# ============================================================================
# Summary
# ============================================================================
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ EXPORT & COPY COMPLETED SUCCESSFULLY${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📦 Package Details:${NC}"
echo "  Backend Image:  ${BACKEND_SIZE}"
echo "  Frontend Image: ${FRONTEND_SIZE}"
echo "  Server Path:    ${SERVER_HOST}:${SERVER_PATH}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "  1. SSH to server: ssh ${SERVER_USER}@${SERVER_HOST}"
echo "  2. Navigate to:   cd ${SERVER_PATH}"
echo "  3. Run deploy:    ./deploy-3-deploy-server.sh"
echo ""
echo -e "${BLUE}Or run from local:${NC}"
echo "  ./scripts/deploy-3-deploy-server.sh"
echo ""
