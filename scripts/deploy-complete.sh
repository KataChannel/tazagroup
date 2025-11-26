#!/bin/bash

# ============================================================================
# TAZAGROUP - Complete Deployment Pipeline
# ============================================================================
# This script orchestrates the complete deployment using quick-deploy-server
# which builds and deploys directly on the server for maximum efficiency
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

# Check if quick-deploy script exists
if [ ! -f "${SCRIPTS_DIR}/quick-deploy-server.sh" ]; then
    echo -e "${RED}❌ quick-deploy-server.sh not found in: ${SCRIPTS_DIR}${NC}"
    exit 1
fi

# Display deployment information
echo -e "${GREEN}📋 Deployment Method:${NC}"
echo ""
echo -e "${YELLOW}▸${NC} Deploy directly on server (faster, no local export)"
echo -e "${YELLOW}▸${NC} Fresh build with no cache"
echo -e "${YELLOW}▸${NC} Zero downtime deployment"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Confirm deployment
read -p "$(echo -e ${YELLOW}Ready to start deployment? [Y/n]: ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ ! -z $REPLY ]]; then
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 0
fi

echo ""
START_TIME=$(date +%s)

# ============================================================================
# Execute Quick Deploy
# ============================================================================
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                  DEPLOYING TO SERVER                      ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

chmod +x "${SCRIPTS_DIR}/quick-deploy-server.sh"
"${SCRIPTS_DIR}/quick-deploy-server.sh"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed.${NC}"
    exit 1
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
echo "  ✅ Code synced to server"
echo "  ✅ Fresh build completed (no cache)"
echo "  ✅ Containers deployed"
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
echo "  View logs:     ssh root@116.118.49.243 'cd /root/tazagroup && docker compose logs -f'"
echo "  Check status:  ssh root@116.118.49.243 'cd /root/tazagroup && docker compose ps'"
echo "  Stop all:      ssh root@116.118.49.243 'cd /root/tazagroup && docker compose down'"
echo "  Restart:       ssh root@116.118.49.243 'cd /root/tazagroup && docker compose restart'"
echo ""

echo -e "${GREEN}🎉 TazaGroup deployment successful!${NC}"
echo ""
