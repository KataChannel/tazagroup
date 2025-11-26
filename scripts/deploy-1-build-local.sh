#!/bin/bash

# ============================================================================
# TAZAGROUP - Build Docker Images Locally
# ============================================================================
# This script builds Docker images using docker-compose with no-cache
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       🐳 TAZAGROUP - BUILD DOCKER IMAGES LOCALLY         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ docker-compose.yml not found${NC}"
    exit 1
fi

echo -e "${GREEN}📦 Build Configuration:${NC}"
echo "  Method: docker-compose build"
echo "  Cache: Disabled (--no-cache)"
echo "  Pull: Enabled (--pull)"
echo ""

# ============================================================================
# Build Backend and Frontend using docker-compose
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔨 Building Backend and Frontend with docker-compose...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BLUE}🐳 Running: docker compose build --no-cache --pull backend frontend${NC}"
echo ""

docker compose build --no-cache --pull backend frontend

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Backend and Frontend images built successfully${NC}"
else
    echo ""
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# ============================================================================
# Display Build Summary
# ============================================================================
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ BUILD COMPLETED SUCCESSFULLY${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BLUE}📦 Built Images:${NC}"
docker compose images backend frontend

echo ""
echo -e "${GREEN}🎉 Images are ready to be exported and deployed to server${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Run: ./scripts/deploy-2-export-images.sh  (Export and copy to server)"
echo "  2. Run: ./scripts/deploy-3-deploy-server.sh  (Deploy on server)"
echo ""
