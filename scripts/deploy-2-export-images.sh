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
SERVER_USER="${SERVER_USER:-it}"
SERVER_HOST="${SERVER_HOST:-116.118.49.243}"
SERVER_PATH="${SERVER_PATH:-/home/it/tazagroup-deploy}"
TEMP_DIR="./docker-images-export"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     📦 TAZAGROUP - EXPORT & COPY IMAGES TO SERVER        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Load image tags from previous build
if [ ! -f ".docker-image-tags" ]; then
    echo -e "${RED}❌ .docker-image-tags file not found. Please run deploy-1-build-local.sh first.${NC}"
    exit 1
fi

source .docker-image-tags

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

BACKEND_TAR="${TEMP_DIR}/backend-${IMAGE_TAG}.tar"

echo -e "${BLUE}💾 Saving image to: ${BACKEND_TAR}${NC}"
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

FRONTEND_TAR="${TEMP_DIR}/frontend-${IMAGE_TAG}.tar"

echo -e "${BLUE}💾 Saving image to: ${FRONTEND_TAR}${NC}"
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
cp .env "${TEMP_DIR}/"
cp .docker-image-tags "${TEMP_DIR}/"

# Create deployment info file
cat > "${TEMP_DIR}/deployment-info.txt" << EOF
TAZAGROUP Deployment Package
============================
Generated: $(date)
Version: ${VERSION}
Image Tag: ${IMAGE_TAG}

Images:
  - Backend:  ${BACKEND_IMAGE} (${BACKEND_SIZE})
  - Frontend: ${FRONTEND_IMAGE} (${FRONTEND_SIZE})

Deployment:
  1. Load images: docker load -i backend-${IMAGE_TAG}.tar.gz
  2. Load images: docker load -i frontend-${IMAGE_TAG}.tar.gz
  3. Update docker-compose.yml with image tags
  4. Run: docker-compose up -d
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
