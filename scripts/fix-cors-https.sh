#!/bin/bash

# ============================================================================
# Fix CORS Headers for HTTPS on appapi.tazagroup.vn
# ============================================================================

set -e

SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-116.118.49.243}"

echo "🔧 Adding CORS Headers to HTTPS Configuration"
echo "=============================================="
echo ""

ssh "${SERVER_USER}@${SERVER_HOST}" << 'ENDSSH'
    set -e
    
    NGINX_CONF="/etc/nginx/sites-available/appapi.tazagroup.vn"
    
    echo "📝 Backing up current configuration..."
    sudo cp "$NGINX_CONF" "${NGINX_CONF}.backup-$(date +%Y%m%d-%H%M%S)"
    
    echo "✏️  Adding CORS headers to HTTPS location block..."
    
    # Create temporary file with updated configuration
    sudo tee "$NGINX_CONF" > /dev/null << 'EOF'
# Tazagroup Backend API - appapi.tazagroup.vn
# Port 13001 (backend tazagroup)

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
        # CORS Headers
        add_header 'Access-Control-Allow-Origin' 'https://app.tazagroup.vn' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,apollo-require-preflight,x-apollo-operation-name,x-apollo-tracing,graphql-upload' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range,Authorization' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://app.tazagroup.vn' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,apollo-require-preflight,x-apollo-operation-name,x-apollo-tracing,graphql-upload' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        
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

    echo "🧪 Testing nginx configuration..."
    sudo nginx -t
    
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    
    echo ""
    echo "✅ CORS headers added successfully to HTTPS configuration!"
    
ENDSSH

echo ""
echo "✅ Configuration Updated!"
echo ""
echo "🧪 Test CORS:"
echo "  curl -X OPTIONS https://appapi.tazagroup.vn/graphql -H 'Origin: https://app.tazagroup.vn' -I"
