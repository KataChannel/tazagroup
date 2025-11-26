#!/bin/bash

# ============================================================================
# TAZAGROUP - Build Docker Images Locally
# ============================================================================
# This script builds Docker images on local machine to reduce server load
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="tazagroup"
VERSION=$(cat VERSION 2>/dev/null || echo "1.0.0")
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
IMAGE_TAG="${VERSION}-${TIMESTAMP}"

BACKEND_IMAGE="${PROJECT_NAME}-backend:${IMAGE_TAG}"
FRONTEND_IMAGE="${PROJECT_NAME}-frontend:${IMAGE_TAG}"
BACKEND_IMAGE_LATEST="${PROJECT_NAME}-backend:latest"
FRONTEND_IMAGE_LATEST="${PROJECT_NAME}-frontend:latest"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       🐳 TAZAGROUP - BUILD DOCKER IMAGES LOCALLY         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}📦 Build Configuration:${NC}"
echo "  Project: ${PROJECT_NAME}"
echo "  Version: ${VERSION}"
echo "  Image Tag: ${IMAGE_TAG}"
echo ""

# ============================================================================
# STEP 1: Build Frontend First (requires build artifacts)
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 STEP 1: Building Frontend (.next-tazagroup)...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd frontend

# Check if .next-tazagroup exists
if [ ! -d ".next-tazagroup" ]; then
    echo -e "${YELLOW}⚠️  .next-tazagroup not found. Building frontend...${NC}"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}📥 Installing frontend dependencies...${NC}"
        bun install
    fi
    
    # Build frontend
    echo -e "${BLUE}🔨 Building Next.js application...${NC}"
    bun run build:tazagroup
    
    if [ ! -d ".next-tazagroup" ]; then
        echo -e "${RED}❌ Frontend build failed. .next-tazagroup directory not created.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .next-tazagroup directory found${NC}"
fi

cd ..

# ============================================================================
# STEP 2: Build Backend Image
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔨 STEP 2: Building Backend Docker Image...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Build backend (TypeScript compilation if needed)
if [ ! -d "backend/dist" ]; then
    echo -e "${BLUE}📥 Building backend TypeScript...${NC}"
    cd backend
    if [ ! -d "node_modules" ]; then
        bun install
    fi
    bun run build
    cd ..
fi

echo -e "${BLUE}🐳 Building Docker image: ${BACKEND_IMAGE}${NC}"
docker build \
    -f backend/Dockerfile \
    -t "${BACKEND_IMAGE}" \
    -t "${BACKEND_IMAGE_LATEST}" \
    --build-arg NODE_ENV=production \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend image built successfully${NC}"
else
    echo -e "${RED}❌ Backend image build failed${NC}"
    exit 1
fi

# ============================================================================
# STEP 3: Build Frontend Image
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔨 STEP 3: Building Frontend Docker Image...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${BLUE}🐳 Building Docker image: ${FRONTEND_IMAGE}${NC}"
docker build \
    -f frontend/Dockerfile.tazagroup \
    -t "${FRONTEND_IMAGE}" \
    -t "${FRONTEND_IMAGE_LATEST}" \
    --build-arg NODE_ENV=production \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend image built successfully${NC}"
else
    echo -e "${RED}❌ Frontend image build failed${NC}"
    exit 1
fi

# ============================================================================
# STEP 4: Display Build Summary
# ============================================================================
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ BUILD COMPLETED SUCCESSFULLY${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📦 Built Images:${NC}"
echo "  Backend:  ${BACKEND_IMAGE}"
echo "  Frontend: ${FRONTEND_IMAGE}"
echo ""

# Display image sizes
echo -e "${BLUE}💾 Image Sizes:${NC}"
docker images | grep "${PROJECT_NAME}" | grep -E "${IMAGE_TAG}|latest" | head -4

echo ""
echo -e "${YELLOW}📝 Image tags have been saved to: .docker-image-tags${NC}"

# Save image tags for later use
cat > .docker-image-tags << EOF
BACKEND_IMAGE=${BACKEND_IMAGE}
FRONTEND_IMAGE=${FRONTEND_IMAGE}
BACKEND_IMAGE_LATEST=${BACKEND_IMAGE_LATEST}
FRONTEND_IMAGE_LATEST=${FRONTEND_IMAGE_LATEST}
IMAGE_TAG=${IMAGE_TAG}
VERSION=${VERSION}
TIMESTAMP=${TIMESTAMP}
EOF

echo ""
echo -e "${GREEN}🎉 Images are ready to be exported and deployed to server${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Run: ./scripts/deploy-2-export-images.sh  (Export and copy to server)"
echo "  2. Run: ./scripts/deploy-3-deploy-server.sh  (Deploy on server)"
echo ""
