#!/bin/bash

# ============================================================================
# TazaGroup - Pre-Deployment Checklist
# ============================================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         ✅ TAZAGROUP DEPLOYMENT CHECKLIST                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        return 0
    else
        echo -e "${RED}❌${NC} $2"
        return 1
    fi
}

check_service() {
    if nc -z -w1 "$1" "$2" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $3 ($1:$2)"
        return 0
    else
        echo -e "${RED}❌${NC} $3 ($1:$2)"
        return 1
    fi
}

ERRORS=0

echo -e "${YELLOW}📋 Checking files...${NC}"
check_file ".env" ".env file exists" || ((ERRORS++))
check_file "docker-compose.yml" "docker-compose.yml exists" || ((ERRORS++))
check_file "backend/Dockerfile" "Backend Dockerfile exists" || ((ERRORS++))
check_file "frontend/Dockerfile.tazagroup" "Frontend Dockerfile exists" || ((ERRORS++))
echo ""

echo -e "${YELLOW}🔌 Checking services on server...${NC}"
SERVER_HOST="116.118.49.243"
check_service "$SERVER_HOST" "13003" "PostgreSQL (TazaGroup)" || ((ERRORS++))
check_service "$SERVER_HOST" "12004" "Redis (Shared)" || ((ERRORS++))
check_service "$SERVER_HOST" "12007" "Minio (Shared)" || ((ERRORS++))
echo ""

echo -e "${YELLOW}🌐 Checking DNS...${NC}"
if host app.tazagroup.vn > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} app.tazagroup.vn resolves"
else
    echo -e "${RED}❌${NC} app.tazagroup.vn resolves"
    ((ERRORS++))
fi

if host appapi.tazagroup.vn > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} appapi.tazagroup.vn resolves"
else
    echo -e "${RED}❌${NC} appapi.tazagroup.vn resolves"
    ((ERRORS++))
fi

if host storage.tazagroup.vn > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} storage.tazagroup.vn resolves"
else
    echo -e "${RED}❌${NC} storage.tazagroup.vn resolves"
    ((ERRORS++))
fi
echo ""

echo -e "${YELLOW}🔐 Checking SSL certificates...${NC}"
if curl -sSf https://appapi.tazagroup.vn > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} SSL for appapi.tazagroup.vn"
else
    echo -e "${YELLOW}⚠️${NC}  SSL for appapi.tazagroup.vn (may need setup)"
fi

if curl -sSf https://app.tazagroup.vn > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} SSL for app.tazagroup.vn"
else
    echo -e "${YELLOW}⚠️${NC}  SSL for app.tazagroup.vn (may need setup)"
fi
echo ""

echo -e "${YELLOW}📊 Summary:${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready to deploy.${NC}"
    echo ""
    echo -e "${BLUE}🚀 To deploy, run:${NC}"
    echo -e "  ${GREEN}bun deploy:quick${NC}  - Quick deploy to server"
    echo -e "  ${GREEN}bun docker:up${NC}     - Start locally"
else
    echo -e "${RED}❌ $ERRORS check(s) failed. Please fix issues before deploying.${NC}"
    exit 1
fi
echo ""
