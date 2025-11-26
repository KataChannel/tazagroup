#!/bin/bash

# ============================================================================
# Update Nginx CORS Configuration for appapi.tazagroup.vn
# ============================================================================

set -e

SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-116.118.49.243}"

echo "🔧 Updating Nginx CORS Configuration on Server..."

# Copy nginx config to server
echo "📤 Uploading nginx configuration..."
scp nginx/appapi.tazagroup.vn "${SERVER_USER}@${SERVER_HOST}:/tmp/appapi.tazagroup.vn"

# Install on server
echo "📦 Installing configuration on server..."
ssh "${SERVER_USER}@${SERVER_HOST}" << 'ENDSSH'
    # Copy to nginx sites-available
    sudo cp /tmp/appapi.tazagroup.vn /etc/nginx/sites-available/appapi.tazagroup.vn
    
    # Create symlink if not exists
    if [ ! -L /etc/nginx/sites-enabled/appapi.tazagroup.vn ]; then
        sudo ln -s /etc/nginx/sites-available/appapi.tazagroup.vn /etc/nginx/sites-enabled/appapi.tazagroup.vn
    fi
    
    # Test nginx configuration
    echo "🧪 Testing nginx configuration..."
    sudo nginx -t
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    
    echo "✅ Nginx configuration updated successfully!"
ENDSSH

echo ""
echo "✅ CORS configuration deployed successfully!"
echo "🌐 Backend API: https://appapi.tazagroup.vn"
echo "🌐 Frontend: https://app.tazagroup.vn"
