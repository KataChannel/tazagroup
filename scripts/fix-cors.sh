#!/bin/bash

# ============================================================================
# Quick Fix CORS Issue - Deploy to Server
# ============================================================================

set -e

echo "🔧 Fixing CORS Issue for Tazagroup"
echo "=================================="
echo ""

echo "📋 This script will:"
echo "  1. Deploy updated nginx configuration with CORS headers"
echo "  2. Reload nginx on the server"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Run the nginx update script
./scripts/update-nginx-cors.sh

echo ""
echo "✅ Done! Please test:"
echo "   Frontend: https://app.tazagroup.vn"
echo "   Backend API: https://appapi.tazagroup.vn/graphql"
