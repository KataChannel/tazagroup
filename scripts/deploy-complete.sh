#!/bin/bash

# ============================================================================
# TAZAGROUP - Complete Deployment Pipeline
# ============================================================================
# This script orchestrates the entire deployment process:
# 1. Build images locally
# 2. Export and copy to server
# 3. Deploy on server
# 4. Cleanup (optional)
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPTS_DIR")"

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                           ║${NC}"
echo -e "${CYAN}║     🚀 TAZAGROUP - COMPLETE DEPLOYMENT PIPELINE 🚀       ║${NC}"
echo -e "${CYAN}║                                                           ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Change to project root
cd "$PROJECT_ROOT"

# Check if scripts exist
if [ ! -f "${SCRIPTS_DIR}/deploy-1-build-local.sh" ]; then
    echo -e "${RED}❌ Deployment scripts not found in: ${SCRIPTS_DIR}${NC}"
    exit 1
fi

# Display deployment information
echo -e "${GREEN}📋 Deployment Overview:${NC}"
echo ""
echo -e "${YELLOW}Step 1:${NC} Build Docker images locally (reduces server load)"
echo -e "${YELLOW}Step 2:${NC} Export and copy images to server"
echo -e "${YELLOW}Step 3:${NC} Deploy containers on server"
echo -e "${YELLOW}Step 4:${NC} Cleanup unused resources (optional)"
echo ""

# Get server configuration
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔧 Server Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "$(echo -e ${YELLOW}Server User [root]: ${NC})" SERVER_USER
SERVER_USER=${SERVER_USER:-root}

read -p "$(echo -e ${YELLOW}Server Host [116.118.49.243]: ${NC})" SERVER_HOST
SERVER_HOST=${SERVER_HOST:-116.118.49.243}

read -p "$(echo -e ${YELLOW}Deploy Path [/root/tazagroup]: ${NC})" SERVER_PATH
SERVER_PATH=${SERVER_PATH:-/root/tazagroup}

export SERVER_USER
export SERVER_HOST
export SERVER_PATH

echo ""
echo -e "${GREEN}✅ Configuration:${NC}"
echo "  Server: ${SERVER_USER}@${SERVER_HOST}"
echo "  Path:   ${SERVER_PATH}"
echo ""

# Confirm deployment
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
read -p "$(echo -e ${YELLOW}Ready to start deployment? [Y/n]: ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ ! -z $REPLY ]]; then
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 0
fi

echo ""
START_TIME=$(date +%s)

# ============================================================================
# STEP 1: Build Images Locally
# ============================================================================
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    STEP 1: BUILD LOCAL                    ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

chmod +x "${SCRIPTS_DIR}/deploy-1-build-local.sh"
"${SCRIPTS_DIR}/deploy-1-build-local.sh"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Deployment aborted.${NC}"
    exit 1
fi

echo ""
read -p "$(echo -e ${YELLOW}Continue to export and copy images? [Y/n]: ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ ! -z $REPLY ]]; then
    echo -e "${YELLOW}⏸️  Deployment paused after build${NC}"
    exit 0
fi

# ============================================================================
# STEP 2: Export and Copy to Server
# ============================================================================
echo ""
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║              STEP 2: EXPORT & COPY TO SERVER              ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

chmod +x "${SCRIPTS_DIR}/deploy-2-export-images.sh"
"${SCRIPTS_DIR}/deploy-2-export-images.sh"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Export/Copy failed. Deployment aborted.${NC}"
    exit 1
fi

echo ""
read -p "$(echo -e ${YELLOW}Continue to deploy on server? [Y/n]: ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ ! -z $REPLY ]]; then
    echo -e "${YELLOW}⏸️  Deployment paused after export${NC}"
    exit 0
fi

# ============================================================================
# STEP 3: Deploy on Server
# ============================================================================
echo ""
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                STEP 3: DEPLOY ON SERVER                   ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

chmod +x "${SCRIPTS_DIR}/deploy-3-deploy-server.sh"
"${SCRIPTS_DIR}/deploy-3-deploy-server.sh" "local"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed.${NC}"
    exit 1
fi

# ============================================================================
# STEP 4: Cleanup (Optional)
# ============================================================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
read -p "$(echo -e ${YELLOW}Do you want to cleanup unused resources? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                   STEP 4: CLEANUP                         ║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    chmod +x "${SCRIPTS_DIR}/deploy-4-cleanup.sh"
    
    # Cleanup local
    echo -e "${CYAN}🧹 Cleaning up LOCAL machine...${NC}"
    "${SCRIPTS_DIR}/deploy-4-cleanup.sh" "local"
    
    echo ""
    read -p "$(echo -e ${YELLOW}Also cleanup SERVER? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${CYAN}🧹 Cleaning up SERVER...${NC}"
        "${SCRIPTS_DIR}/deploy-4-cleanup.sh" "server"
    fi
fi

# ============================================================================
# Deployment Complete
# ============================================================================
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║          ✅ DEPLOYMENT COMPLETED SUCCESSFULLY ✅          ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}📊 Deployment Summary:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "  ✅ Images built locally"
echo "  ✅ Images exported and copied to server"
echo "  ✅ Containers deployed on server"
echo "  ✅ Application is running"
echo ""
echo -e "${CYAN}⏱️  Total Time:${NC} ${MINUTES}m ${SECONDS}s"
echo ""

echo -e "${CYAN}🌐 Access URLs:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "  Frontend:  https://app.tazagroup.vn"
echo "  Backend:   https://appapi.tazagroup.vn"
echo "  GraphQL:   https://appapi.tazagroup.vn/graphql"
echo ""

echo -e "${CYAN}📝 Useful Commands:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "  View logs:     ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_PATH} && docker compose logs -f'"
echo "  Check status:  ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_PATH} && docker compose ps'"
echo "  Stop all:      ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_PATH} && docker compose down'"
echo "  Restart:       ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_PATH} && docker compose restart'"
echo ""

echo -e "${GREEN}🎉 TazaGroup deployment successful!${NC}"
echo ""
