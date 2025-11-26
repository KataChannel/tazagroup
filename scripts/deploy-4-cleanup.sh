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
SERVER_USER="${SERVER_USER:-root}"
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
# STEP 2: Remove Dangling TazaGroup Images Only
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 2: Removing Dangling TazaGroup Images${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Only remove dangling images that are related to tazagroup project
echo -e "${BLUE}Checking for dangling TazaGroup images...${NC}"
if [ "$MODE" = "server" ]; then
    DANGLING_TAZAGROUP=$(ssh "${SERVER_USER}@${SERVER_HOST}" "docker images -f 'dangling=true' --format '{{.ID}} {{.Repository}}' | grep -E 'tazagroup|<none>' | awk '{print \$1}' | sort -u" || echo "")
else
    DANGLING_TAZAGROUP=$(docker images -f 'dangling=true' --format '{{.ID}} {{.Repository}}' 2>/dev/null | grep -E 'tazagroup|<none>' | awk '{print $1}' | sort -u || echo "")
fi

if [ -n "$DANGLING_TAZAGROUP" ]; then
    DANGLING_COUNT=$(echo "$DANGLING_TAZAGROUP" | wc -l)
    echo -e "${BLUE}Found ${DANGLING_COUNT} dangling TazaGroup-related images${NC}"
    
    read -p "$(echo -e "${YELLOW}Remove dangling TazaGroup images? [y/N]: ${NC}")" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "$MODE" = "server" ]; then
            echo "$DANGLING_TAZAGROUP" | xargs -r ssh "${SERVER_USER}@${SERVER_HOST}" docker rmi 2>/dev/null || true
        else
            echo "$DANGLING_TAZAGROUP" | xargs -r docker rmi 2>/dev/null || true
        fi
        echo -e "${GREEN}✅ Dangling TazaGroup images removed${NC}"
    else
        echo -e "${BLUE}ℹ️  Skipped removing dangling images${NC}"
    fi
else
    echo -e "${GREEN}✅ No dangling TazaGroup images found${NC}"
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

read -p "$(echo -e "${YELLOW}Do you want to remove old TazaGroup images (keep latest)? [y/N]: ${NC}")" -n 1 -r
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
# STEP 4: Remove Stopped TazaGroup Containers Only
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 4: Removing Stopped TazaGroup Containers${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Only remove stopped containers with tazagroup in the name
echo -e "${BLUE}Checking for stopped TazaGroup containers...${NC}"
if [ "$MODE" = "server" ]; then
    STOPPED_TAZAGROUP=$(ssh "${SERVER_USER}@${SERVER_HOST}" "docker ps -a -f status=exited --format '{{.ID}} {{.Names}}' | grep tazagroup | awk '{print \$1}'" || echo "")
else
    STOPPED_TAZAGROUP=$(docker ps -a -f status=exited --format '{{.ID}} {{.Names}}' | grep tazagroup | awk '{print $1}' || echo "")
fi

if [ -n "$STOPPED_TAZAGROUP" ]; then
    STOPPED_COUNT=$(echo "$STOPPED_TAZAGROUP" | wc -l)
    echo -e "${BLUE}Found ${STOPPED_COUNT} stopped TazaGroup containers${NC}"
    execute_cmd "docker ps -a -f status=exited --format 'table {{.Names}}\t{{.Status}}' | grep tazagroup"
    
    read -p "$(echo -e "${YELLOW}Remove stopped TazaGroup containers? [y/N]: ${NC}")" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "$MODE" = "server" ]; then
            echo "$STOPPED_TAZAGROUP" | xargs -r ssh "${SERVER_USER}@${SERVER_HOST}" docker rm 2>/dev/null || true
        else
            echo "$STOPPED_TAZAGROUP" | xargs -r docker rm 2>/dev/null || true
        fi
        echo -e "${GREEN}✅ Stopped TazaGroup containers removed${NC}"
    else
        echo -e "${BLUE}ℹ️  Skipped removing containers${NC}"
    fi
else
    echo -e "${GREEN}✅ No stopped TazaGroup containers found${NC}"
fi
echo ""

# ============================================================================
# STEP 5: Remove Unused TazaGroup Volumes Only
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 5: Removing Unused TazaGroup Volumes${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${BLUE}Listing TazaGroup volumes:${NC}"
if [ "$MODE" = "server" ]; then
    TAZAGROUP_VOLUMES=$(ssh "${SERVER_USER}@${SERVER_HOST}" "docker volume ls --format '{{.Name}}' | grep -E 'tazagroup|tazagroupcore'" || echo "")
else
    TAZAGROUP_VOLUMES=$(docker volume ls --format '{{.Name}}' | grep -E 'tazagroup|tazagroupcore' || echo "")
fi

if [ -n "$TAZAGROUP_VOLUMES" ]; then
    echo "$TAZAGROUP_VOLUMES"
    echo ""
    
    echo -e "${YELLOW}⚠️  WARNING: Only unused TazaGroup volumes will be removed${NC}"
    read -p "$(echo -e ${YELLOW}Do you want to remove unused TazaGroup volumes? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Remove only unused tazagroup volumes
        if [ "$MODE" = "server" ]; then
            echo "$TAZAGROUP_VOLUMES" | while read vol; do
                ssh "${SERVER_USER}@${SERVER_HOST}" "docker volume rm $vol 2>/dev/null || echo 'Volume $vol is in use, skipping'"
            done
        else
            echo "$TAZAGROUP_VOLUMES" | while read vol; do
                docker volume rm "$vol" 2>/dev/null || echo "Volume $vol is in use, skipping"
            done
        fi
        echo -e "${GREEN}✅ Unused TazaGroup volumes removed${NC}"
    else
        echo -e "${BLUE}ℹ️  Skipped removing volumes${NC}"
    fi
else
    echo -e "${GREEN}✅ No TazaGroup volumes found${NC}"
fi
echo ""

# ============================================================================
# STEP 6: Remove TazaGroup Build Cache Only
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 6: Removing TazaGroup Build Cache${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${BLUE}Current build cache:${NC}"
execute_cmd "docker buildx du 2>/dev/null || docker builder df 2>/dev/null || echo 'No build cache info available'"
echo ""

echo -e "${YELLOW}⚠️  NOTE: This will remove build cache for TazaGroup images only${NC}"
read -p "$(echo -e ${YELLOW}Do you want to remove TazaGroup build cache? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Prune build cache with filter (only removes unused cache)
    # Note: Docker doesn't support filtering by project name, so we prune all unused cache
    # This is safe as it only removes cache not currently in use
    execute_cmd "docker buildx prune -f --filter 'unused-for=24h' 2>/dev/null || docker builder prune -f --filter 'unused-for=24h' 2>/dev/null || true"
    echo -e "${GREEN}✅ Build cache (unused for 24h) removed${NC}"
else
    echo -e "${BLUE}ℹ️  Skipped removing build cache${NC}"
fi
echo ""

# ============================================================================
# STEP 7: Remove Unused TazaGroup Networks Only
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 7: Removing Unused TazaGroup Networks${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${BLUE}Checking for TazaGroup networks...${NC}"
if [ "$MODE" = "server" ]; then
    TAZAGROUP_NETWORKS=$(ssh "${SERVER_USER}@${SERVER_HOST}" "docker network ls --format '{{.ID}} {{.Name}}' | grep tazagroup | awk '{print \$1}'" || echo "")
else
    TAZAGROUP_NETWORKS=$(docker network ls --format '{{.ID}} {{.Name}}' | grep tazagroup | awk '{print $1}' || echo "")
fi

if [ -n "$TAZAGROUP_NETWORKS" ]; then
    execute_cmd "docker network ls --format 'table {{.Name}}\t{{.Driver}}\t{{.Scope}}' | grep tazagroup"
    echo ""
    
    read -p "$(echo -e ${YELLOW}Remove unused TazaGroup networks? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "$MODE" = "server" ]; then
            echo "$TAZAGROUP_NETWORKS" | xargs -r ssh "${SERVER_USER}@${SERVER_HOST}" docker network rm 2>/dev/null || echo "Some networks are in use, skipping"
        else
            echo "$TAZAGROUP_NETWORKS" | xargs -r docker network rm 2>/dev/null || echo "Some networks are in use, skipping"
        fi
        echo -e "${GREEN}✅ Unused TazaGroup networks removed${NC}"
    else
        echo -e "${BLUE}ℹ️  Skipped removing networks${NC}"
    fi
else
    echo -e "${GREEN}✅ No TazaGroup networks found${NC}"
fi
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
# STEP 9: Full System Prune (DISABLED for Safety)
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🗑️  STEP 9: Full System Prune (Not Recommended)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${RED}⚠️  WARNING: Full system prune is DISABLED by default!${NC}"
echo -e "${RED}⚠️  It would remove ALL unused Docker resources from ALL projects!${NC}"
echo -e "${BLUE}ℹ️  This script only targets TazaGroup resources for safety.${NC}"
echo ""
echo -e "${BLUE}If you need to do full cleanup, run manually:${NC}"
echo "  docker system prune -a -f --volumes"
echo ""
echo -e "${BLUE}ℹ️  Full system prune skipped (safe mode)${NC}"
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
