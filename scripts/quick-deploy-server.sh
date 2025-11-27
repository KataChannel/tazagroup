#!/bin/bash

# ============================================================================
# Quick Deploy TazaGroup to Server
# ============================================================================

set -e

SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-116.118.49.243}"
SERVER_PATH="${SERVER_PATH:-/root/tazagroup}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🚀 QUICK DEPLOY TAZAGROUP TO SERVER                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}📦 Copying files to server...${NC}"
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'backend/node_modules' --exclude 'frontend/node_modules' \
    --exclude 'frontend/.next' --exclude 'backend/dist' --exclude 'docker-images-export' \
    ./ "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"

echo ""
echo -e "${YELLOW}🔧 Deploying on server...${NC}"
ssh "${SERVER_USER}@${SERVER_HOST}" << ENDSSH
    set -e
    cd ${SERVER_PATH}
    
    echo "📋 Stopping existing containers..."
    docker compose down || true
    
    echo "🏗️  Building images with latest code (no cache)..."
    docker compose build --no-cache --pull backend frontend
    
    echo "🚀 Starting services..."
    docker compose up -d
    
    echo "⏳ Waiting for services to be healthy..."
    sleep 10
    
    echo "📊 Container status:"
    docker compose ps
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "🌐 Access URLs:"
    echo "  Frontend:  https://app.tazagroup.vn"
    echo "  Backend:   https://appapi.tazagroup.vn/graphql"
    echo "  Storage:   https://storage.tazagroup.vn"
    echo ""
    echo "📝 View logs:"
    echo "  docker compose logs -f"
ENDSSH

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}🔍 To check status on server:${NC}"
echo -e "  ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_PATH} && docker compose ps'"
echo ""
echo -e "${BLUE}📋 To view logs:${NC}"
echo -e "  ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${SERVER_PATH} && docker compose logs -f'"
