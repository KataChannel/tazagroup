#!/bin/bash

# ============================================================================
# Deploy TazaGroup Stack
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          🚀 TAZAGROUP - DEPLOY STACK                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

MODE="${1:-up}"  # up, down, restart, logs

case "$MODE" in
    up)
        echo -e "${YELLOW}📦 Building and starting TazaGroup services (no cache)...${NC}"
        docker-compose build --no-cache backend frontend
        docker-compose up -d
        echo ""
        echo -e "${GREEN}✅ Services started with fresh builds!${NC}"
        echo ""
        echo -e "${BLUE}📊 Container Status:${NC}"
        docker-compose ps
        echo ""
        echo -e "${BLUE}🌐 Access URLs:${NC}"
        echo -e "  Frontend:  ${GREEN}https://app.tazagroup.vn${NC}"
        echo -e "  Backend:   ${GREEN}https://appapi.tazagroup.vn/graphql${NC}"
        echo -e "  Storage:   ${GREEN}https://storage.tazagroup.vn${NC}"
        echo -e "  Minio UI:  ${GREEN}http://116.118.49.243:12008${NC}"
        echo ""
        echo -e "${YELLOW}📝 View logs:${NC}"
        echo -e "  docker-compose logs -f"
        ;;
    
    down)
        echo -e "${YELLOW}🛑 Stopping TazaGroup services...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Services stopped!${NC}"
        ;;
    
    restart)
        echo -e "${YELLOW}🔄 Restarting TazaGroup services...${NC}"
        docker-compose restart
        echo -e "${GREEN}✅ Services restarted!${NC}"
        docker-compose ps
        ;;
    
    logs)
        echo -e "${BLUE}📋 Following logs (Ctrl+C to stop)...${NC}"
        docker-compose logs -f
        ;;
    
    status)
        echo -e "${BLUE}📊 Container Status:${NC}"
        docker-compose ps
        echo ""
        echo -e "${BLUE}💾 Volume Usage:${NC}"
        docker system df -v | grep tazagroup
        ;;
    
    rebuild)
        echo -e "${YELLOW}🔨 Rebuilding and restarting services (no cache)...${NC}"
        docker-compose down
        docker-compose build --no-cache --pull backend frontend
        docker-compose up -d
        echo -e "${GREEN}✅ Services rebuilt with latest code and started!${NC}"
        docker-compose ps
        ;;
    
    *)
        echo -e "${RED}❌ Invalid command: $MODE${NC}"
        echo ""
        echo -e "${YELLOW}Usage:${NC}"
        echo -e "  $0 ${GREEN}up${NC}       - Start services"
        echo -e "  $0 ${GREEN}down${NC}     - Stop services"
        echo -e "  $0 ${GREEN}restart${NC}  - Restart services"
        echo -e "  $0 ${GREEN}logs${NC}     - View logs"
        echo -e "  $0 ${GREEN}status${NC}   - Show status"
        echo -e "  $0 ${GREEN}rebuild${NC}  - Rebuild and restart"
        exit 1
        ;;
esac

echo ""
