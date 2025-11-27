#!/bin/bash

# ============================================================================
# Clean Build Artifacts and Docker Cache
# ============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         🧹 CLEAN BUILD ARTIFACTS & CACHE                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Clean frontend build artifacts
echo -e "${YELLOW}🗑️  Cleaning frontend build artifacts...${NC}"
cd frontend
rm -rf .next .next-rausach .next-tazagroup
rm -rf node_modules/.cache
echo -e "${GREEN}✅ Frontend cleaned${NC}"
cd ..

# Clean backend build artifacts
echo -e "${YELLOW}🗑️  Cleaning backend build artifacts...${NC}"
cd backend
rm -rf dist node_modules/.cache
echo -e "${GREEN}✅ Backend cleaned${NC}"
cd ..

# Clean Docker cache
echo -e "${YELLOW}🗑️  Cleaning Docker build cache...${NC}"
docker builder prune -f
echo -e "${GREEN}✅ Docker cache cleaned${NC}"

# Clean dangling images
echo -e "${YELLOW}🗑️  Cleaning dangling Docker images...${NC}"
docker image prune -f
echo -e "${GREEN}✅ Dangling images cleaned${NC}"

echo ""
echo -e "${GREEN}✅ All build artifacts and cache cleaned!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "  ${YELLOW}bun docker:build${NC}    - Build fresh images"
echo -e "  ${YELLOW}bun docker:rebuild${NC}  - Build and start services"
echo -e "  ${YELLOW}bun deploy:quick${NC}    - Deploy to server with fresh build"
echo ""
