#!/bin/bash

# ============================================================================
# Setup SSL Certificate for appapi.tazagroup.vn
# ============================================================================

set -e

SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-116.118.49.243}"
DOMAIN="appapi.tazagroup.vn"
EMAIL="${SSL_EMAIL:-admin@tazagroup.vn}"

echo "🔐 Setting up SSL Certificate for $DOMAIN"
echo "=========================================="
echo ""

# Run on server
ssh "${SERVER_USER}@${SERVER_HOST}" << ENDSSH
    set -e
    
    echo "📋 Installing SSL certificate for ${DOMAIN}..."
    
    # Request certificate from Let's Encrypt
    sudo certbot --nginx \
        -d ${DOMAIN} \
        --email ${EMAIL} \
        --agree-tos \
        --no-eff-email \
        --redirect \
        --non-interactive
    
    # Test nginx configuration
    echo "🧪 Testing nginx configuration..."
    sudo nginx -t
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    
    echo ""
    echo "✅ SSL Certificate installed successfully!"
    echo "🌐 Your API is now available at: https://${DOMAIN}"
    
    # Show certificate info
    echo ""
    echo "📜 Certificate Information:"
    sudo certbot certificates -d ${DOMAIN}
ENDSSH

echo ""
echo "✅ SSL Setup Complete!"
echo ""
echo "Test your API:"
echo "  curl -I https://${DOMAIN}/graphql"
echo ""
echo "Auto-renewal is configured. Certificates will renew automatically."
