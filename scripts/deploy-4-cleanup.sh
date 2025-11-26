#!/bin/bash

# ============================================================================
# TAZAGROUP - Cleanup Docker Resources
# ============================================================================
# This script cleans up unused Docker resources on both local and server
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MODE="${1:-local}"  # local or server
SERVER_USER="${SERVER_USER:-it}"
SERVER_HOST="${SERVER_HOST:-116.118.49.243}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🧹 TAZAGROUP - CLEANUP DOCKER RESOURCES           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$MODE" = "server" ]; then
    echo -e "${YELLOW}📍 Running cleanup on SERVER: ${SERVER_HOST}${NC}"
    echo ""
else
    echo -e "${YELLOW}📍 Running cleanup on LOCAL machine${NC}"
    echo ""
fi

# Function to execute command (locally or on server)
execute_cmd() {
    if [ "$MODE" = "server" ]; then
        ssh "${SERVER_USER}@${SERVER_HOST}" "$1"
    else
        eval "$1"
    fi
}

# Function to show disk usage
show_disk_usage() {
    echo -e "${BLUE}💾 Current Docker Disk Usage:${NC}"
    execute_cmd "docker system df"
    echo ""
}

# ============================================================================
# STEP 1: Show Current Usage
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📊 STEP 1: Current Docker Usage${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
show_disk_usage

# ============================================================================
# STEP 2: Remove Dangling Images
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 2: Removing Dangling Images${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

DANGLING_COUNT=$(execute_cmd "docker images -f 'dangling=true' -q | wc -l")
if [ "$DANGLING_COUNT" -gt 0 ]; then
    echo -e "${BLUE}Found ${DANGLING_COUNT} dangling images${NC}"
    execute_cmd "docker rmi \$(docker images -f 'dangling=true' -q) 2>/dev/null || true"
    echo -e "${GREEN}✅ Dangling images removed${NC}"
else
    echo -e "${GREEN}✅ No dangling images found${NC}"
fi
echo ""

# ============================================================================
# STEP 3: Remove Old TazaGroup Images
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 3: Cleaning Old TazaGroup Images${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${BLUE}Listing TazaGroup images:${NC}"
execute_cmd "docker images | grep tazagroup || echo 'No TazaGroup images found'"
echo ""

read -p "$(echo -e ${YELLOW}Do you want to remove old TazaGroup images (keep latest)? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Keep only the latest tag, remove others
    execute_cmd "docker images 'tazagroup-backend' --format '{{.Repository}}:{{.Tag}}' | grep -v 'latest' | xargs -r docker rmi 2>/dev/null || true"
    execute_cmd "docker images 'tazagroup-frontend' --format '{{.Repository}}:{{.Tag}}' | grep -v 'latest' | xargs -r docker rmi 2>/dev/null || true"
    echo -e "${GREEN}✅ Old TazaGroup images removed${NC}"
else
    echo -e "${BLUE}ℹ️  Skipped removing old images${NC}"
fi
echo ""

# ============================================================================
# STEP 4: Remove Stopped Containers
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 4: Removing Stopped Containers${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

STOPPED_COUNT=$(execute_cmd "docker ps -a -q -f status=exited | wc -l")
if [ "$STOPPED_COUNT" -gt 0 ]; then
    echo -e "${BLUE}Found ${STOPPED_COUNT} stopped containers${NC}"
    execute_cmd "docker container prune -f"
    echo -e "${GREEN}✅ Stopped containers removed${NC}"
else
    echo -e "${GREEN}✅ No stopped containers found${NC}"
fi
echo ""

# ============================================================================
# STEP 5: Remove Unused Volumes
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 5: Removing Unused Volumes${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${BLUE}Listing volumes:${NC}"
execute_cmd "docker volume ls"
echo ""

read -p "$(echo -e ${YELLOW}Do you want to remove unused volumes? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    execute_cmd "docker volume prune -f"
    echo -e "${GREEN}✅ Unused volumes removed${NC}"
else
    echo -e "${BLUE}ℹ️  Skipped removing volumes${NC}"
fi
echo ""

# ============================================================================
# STEP 6: Remove Build Cache
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 6: Removing Build Cache${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${BLUE}Current build cache:${NC}"
execute_cmd "docker buildx du 2>/dev/null || docker builder df 2>/dev/null || echo 'No build cache info available'"
echo ""

read -p "$(echo -e ${YELLOW}Do you want to remove build cache? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    execute_cmd "docker buildx prune -f 2>/dev/null || docker builder prune -f 2>/dev/null || true"
    echo -e "${GREEN}✅ Build cache removed${NC}"
else
    echo -e "${BLUE}ℹ️  Skipped removing build cache${NC}"
fi
echo ""

# ============================================================================
# STEP 7: Remove Unused Networks
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 7: Removing Unused Networks${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

execute_cmd "docker network prune -f"
echo -e "${GREEN}✅ Unused networks removed${NC}"
echo ""

# ============================================================================
# STEP 8: Clean Local Export Files (Local only)
# ============================================================================
if [ "$MODE" = "local" ]; then
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🗑️  STEP 8: Cleaning Local Export Files${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if [ -d "docker-images-export" ]; then
        EXPORT_SIZE=$(du -sh docker-images-export 2>/dev/null | cut -f1)
        echo -e "${BLUE}Found export directory: ${EXPORT_SIZE}${NC}"
        
        read -p "$(echo -e ${YELLOW}Do you want to remove export files? [y/N]: ${NC})" -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf docker-images-export
            echo -e "${GREEN}✅ Export files removed${NC}"
        else
            echo -e "${BLUE}ℹ️  Skipped removing export files${NC}"
        fi
    else
        echo -e "${GREEN}✅ No export files found${NC}"
    fi
    echo ""
fi

# ============================================================================
# STEP 9: Full System Prune (Optional)
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 9: Full System Prune (Optional)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${RED}⚠️  WARNING: This will remove ALL unused Docker resources!${NC}"
read -p "$(echo -e ${YELLOW}Do you want to run full system prune? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    execute_cmd "docker system prune -a -f --volumes"
    echo -e "${GREEN}✅ Full system prune completed${NC}"
else
    echo -e "${BLUE}ℹ️  Skipped full system prune${NC}"
fi
echo ""

# ============================================================================
# STEP 10: Final Disk Usage
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📊 STEP 10: Final Docker Disk Usage${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
show_disk_usage

# ============================================================================
# Summary
# ============================================================================
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ CLEANUP COMPLETED${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📝 Summary:${NC}"
echo "  ✅ Dangling images removed"
echo "  ✅ Old images cleaned"
echo "  ✅ Stopped containers removed"
echo "  ✅ Unused networks removed"
echo "  ✅ Build cache cleared (if selected)"
echo "  ✅ Unused volumes removed (if selected)"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "  • Run this script regularly to free up disk space"
echo "  • Keep at least one backup of production images"
echo "  • Monitor disk usage: docker system df"
echo ""

if [ "$MODE" = "local" ]; then
    echo -e "${BLUE}🌐 To cleanup on SERVER, run:${NC}"
    echo "  ./scripts/deploy-4-cleanup.sh server"
    echo ""
fi
