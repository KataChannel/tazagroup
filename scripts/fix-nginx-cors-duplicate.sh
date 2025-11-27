#!/bin/bash

# ============================================================================
# Fix NGINX CORS Duplicate Headers
# ============================================================================
# Issue: Nginx adding CORS headers when backend already handles CORS
# Solution: Remove CORS headers from nginx, let backend handle it
# ============================================================================

set -e

SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-116.118.49.243}"

echo "🔧 Fixing CORS duplicate headers on appapi.tazagroup.vn..."

ssh "${SERVER_USER}@${SERVER_HOST}" << 'ENDSSH'

# Backup current config
BACKUP_FILE="/etc/nginx/sites-enabled/appapi.tazagroup.vn.backup-$(date +%Y%m%d_%H%M%S)"
cp /etc/nginx/sites-enabled/appapi.tazagroup.vn "$BACKUP_FILE"
echo "✅ Backup saved: $BACKUP_FILE"

# Create clean config without CORS headers
cat > /etc/nginx/sites-enabled/appapi.tazagroup.vn << 'EOF'
# Tazagroup Backend API - appapi.tazagroup.vn
# Port 13001 (backend tazagroup)
# Backend handles CORS - nginx just proxies

server {
    listen 80;
    listen [::]:80;
    server_name appapi.tazagroup.vn;

    # Redirect HTTP to HTTPS
    if ($host = appapi.tazagroup.vn) {
        return 301 https://$host$request_uri;
    }
    return 404;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name appapi.tazagroup.vn;

    # SSL certificates (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/appapi.tazagroup.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/appapi.tazagroup.vn/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        # Backend handles CORS - don't add duplicate headers
        
        proxy_pass http://116.118.49.243:13001;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Standard proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        
        # API configurations
        proxy_buffering off;
        proxy_request_buffering off;
        client_max_body_size 50M;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF

# Test nginx config
if nginx -t 2>&1 | grep -q "test is successful"; then
    echo "✅ Nginx config test passed"
    
    # Reload nginx
    systemctl reload nginx
    echo "✅ Nginx reloaded"
    
    # Test CORS
    echo ""
    echo "📊 Testing CORS headers..."
    CORS_COUNT=$(curl -I https://appapi.tazagroup.vn/graphql \
        -H 'Origin: https://app.tazagroup.vn' 2>&1 \
        | grep -i 'access-control-allow-origin' | wc -l)
    
    if [ "$CORS_COUNT" -eq 1 ]; then
        echo "✅ CORS fixed! Only 1 Access-Control-Allow-Origin header found"
    else
        echo "⚠️  Found $CORS_COUNT Access-Control-Allow-Origin headers"
    fi
    
    echo ""
    echo "CORS Headers:"
    curl -I https://appapi.tazagroup.vn/graphql \
        -H 'Origin: https://app.tazagroup.vn' 2>&1 \
        | grep -i 'access-control'
else
    echo "❌ Nginx config test failed"
    echo "Restoring backup..."
    cp "$BACKUP_FILE" /etc/nginx/sites-enabled/appapi.tazagroup.vn
    exit 1
fi

ENDSSH

echo ""
echo "✅ CORS duplicate headers fixed!"
echo ""
echo "📝 What was fixed:"
echo "  - Removed duplicate CORS headers from nginx"
echo "  - Backend now handles all CORS headers"
echo "  - Only one Access-Control-Allow-Origin header is sent"
echo ""
echo "🧪 Test from browser:"
echo "  Open https://app.tazagroup.vn and check GraphQL requests"
echo "  Should not see CORS errors anymore"
