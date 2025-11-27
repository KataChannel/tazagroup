# 🔧 CORS Duplicate Headers Bug Fix

## Issue
```
Access to fetch at 'https://appapi.tazagroup.vn/graphql' from origin 'https://app.tazagroup.vn' 
has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header contains multiple 
values 'https://app.tazagroup.vn, https://app.tazagroup.vn', but only one is allowed.
```

## Root Cause

The `Access-Control-Allow-Origin` header was being added **twice**:

1. **By Backend (NestJS)** - Backend has CORS configured to handle GraphQL requests
2. **By Nginx** - Nginx config had `add_header 'Access-Control-Allow-Origin'` directives

When both added the same header, browsers rejected the response due to duplicate values.

## Investigation

### Test backend directly
```bash
curl -I http://localhost:13001/graphql -H 'Origin: https://app.tazagroup.vn'
```

**Result:** Backend already sends CORS headers:
```
Access-Control-Allow-Origin: https://app.tazagroup.vn
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: Content-Length,Content-Type,Authorization
```

### Test through nginx
```bash
curl -I https://appapi.tazagroup.vn/graphql -H 'Origin: https://app.tazagroup.vn'
```

**Before fix:** Multiple `Access-Control-Allow-Origin` headers (duplicate values)
**After fix:** Only one header from backend

## Solution

**Remove CORS headers from nginx config** - Let backend handle all CORS logic.

### Old nginx config (WRONG)
```nginx
location / {
    # ❌ These duplicate headers from backend
    add_header 'Access-Control-Allow-Origin' 'https://app.tazagroup.vn' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
    add_header 'Access-Control-Allow-Headers' '...' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    
    if ($request_method = 'OPTIONS') {
        # ❌ More duplicate headers
        add_header 'Access-Control-Allow-Origin' 'https://app.tazagroup.vn' always;
        ...
        return 204;
    }
    
    proxy_pass http://116.118.49.243:13001;
    ...
}
```

### New nginx config (CORRECT)
```nginx
location / {
    # ✅ Backend handles CORS - nginx just proxies
    
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
    
    # API configurations
    proxy_buffering off;
    proxy_request_buffering off;
    client_max_body_size 50M;
    
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

## Implementation Steps

### Manual Fix

1. **Backup current config**
```bash
ssh root@116.118.49.243
cp /etc/nginx/sites-enabled/appapi.tazagroup.vn \
   /etc/nginx/sites-enabled/appapi.tazagroup.vn.backup
```

2. **Edit config**
```bash
nano /etc/nginx/sites-enabled/appapi.tazagroup.vn
```

Remove all `add_header 'Access-Control-*'` lines and the `if ($request_method = 'OPTIONS')` block.

3. **Test config**
```bash
nginx -t
```

4. **Reload nginx**
```bash
systemctl reload nginx
```

### Automated Fix

Use the provided script:
```bash
./scripts/fix-nginx-cors-duplicate.sh
```

The script will:
- ✅ Backup current config with timestamp
- ✅ Apply clean config without CORS headers
- ✅ Test nginx config
- ✅ Reload nginx if test passes
- ✅ Verify CORS headers count
- ✅ Rollback if anything fails

## Verification

### Check CORS headers count
```bash
curl -I https://appapi.tazagroup.vn/graphql \
  -H 'Origin: https://app.tazagroup.vn' 2>&1 \
  | grep -c 'Access-Control-Allow-Origin'
```

**Expected:** `1` (only one header)

### View CORS headers
```bash
curl -I https://appapi.tazagroup.vn/graphql \
  -H 'Origin: https://app.tazagroup.vn' 2>&1 \
  | grep -i 'access-control'
```

**Expected output:**
```
access-control-allow-origin: https://app.tazagroup.vn
access-control-allow-credentials: true
access-control-expose-headers: Content-Length,Content-Type,Authorization
```

### Test GraphQL request
```bash
curl https://appapi.tazagroup.vn/graphql \
  -H 'Origin: https://app.tazagroup.vn' \
  -H 'Content-Type: application/json' \
  -d '{"query":"{__typename}"}'
```

**Expected:** `{"data":{"__typename":"Query"}}`

### Test in browser
1. Open https://app.tazagroup.vn
2. Open DevTools → Network tab
3. Trigger a GraphQL request
4. Check response headers
5. Should see only one `Access-Control-Allow-Origin` header
6. No CORS errors in console

### Test OPTIONS preflight
```bash
curl -X OPTIONS https://appapi.tazagroup.vn/graphql \
  -H 'Origin: https://app.tazagroup.vn' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: Content-Type' \
  -I
```

**Expected headers:**
```
access-control-allow-origin: https://app.tazagroup.vn
access-control-allow-credentials: true
access-control-allow-methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
access-control-allow-headers: Content-Type,Authorization,...
access-control-max-age: 86400
```

## Why This Approach?

### Backend handles CORS (Recommended) ✅
**Pros:**
- Single source of truth for CORS policy
- Application-level control
- Easy to test and debug
- Can use environment variables for allowed origins
- Dynamic CORS based on request context
- Works in development and production

**Cons:**
- None for our use case

### Nginx handles CORS ❌
**Pros:**
- Centralized in one place
- Can handle before reaching backend

**Cons:**
- Duplicate headers if backend also handles CORS
- Hard to make dynamic based on environment
- Requires nginx reload for changes
- Can't use application logic for CORS decisions

## Backend CORS Configuration

The backend CORS is configured in NestJS:

**File:** `backend/src/main.ts`
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'https://app.tazagroup.vn',
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    // ... other headers
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
});
```

This configuration:
- ✅ Allows requests from `https://app.tazagroup.vn`
- ✅ Enables credentials (cookies, auth headers)
- ✅ Exposes necessary headers to frontend
- ✅ Handles all HTTP methods including OPTIONS preflight

## Related Files

- **Nginx config:** `/etc/nginx/sites-enabled/appapi.tazagroup.vn`
- **Backend CORS:** `backend/src/main.ts`
- **Fix script:** `scripts/fix-nginx-cors-duplicate.sh`

## Prevention

To prevent this issue in future:

1. **Document CORS responsibility:** Backend handles CORS, nginx just proxies
2. **Template nginx configs:** Use clean proxy config without CORS
3. **Automated testing:** CI/CD should test CORS headers count
4. **Code review:** Check for duplicate CORS in nginx configs

## Troubleshooting

### Still seeing duplicate headers?

1. **Check for multiple nginx configs:**
```bash
grep -r "Access-Control-Allow-Origin" /etc/nginx/sites-enabled/
```

2. **Check nginx includes:**
```bash
grep -r "include" /etc/nginx/sites-enabled/appapi.tazagroup.vn
```

3. **Check backend CORS config:**
```bash
# Test backend directly (bypass nginx)
curl -I http://localhost:13001/graphql -H 'Origin: https://app.tazagroup.vn'
```

4. **Check for load balancer/CDN adding headers:**
```bash
# Use curl -v to see all headers
curl -v https://appapi.tazagroup.vn/graphql -H 'Origin: https://app.tazagroup.vn'
```

### CORS working but other origins blocked?

This is expected! CORS is working correctly - only `https://app.tazagroup.vn` is allowed.

To allow additional origins, update backend config in `backend/src/main.ts`:
```typescript
origin: [
  'https://app.tazagroup.vn',
  'https://admin.tazagroup.vn',  // Add more origins
],
```

### Preflight OPTIONS not working?

Backend handles OPTIONS automatically. Check:
```bash
curl -X OPTIONS https://appapi.tazagroup.vn/graphql \
  -H 'Origin: https://app.tazagroup.vn' \
  -H 'Access-Control-Request-Method: POST'
```

Should return 200/204 with CORS headers.

## Summary

✅ **Fixed:** Removed duplicate CORS headers from nginx  
✅ **Solution:** Let backend handle all CORS logic  
✅ **Verified:** Only one `Access-Control-Allow-Origin` header sent  
✅ **Script:** `scripts/fix-nginx-cors-duplicate.sh` for automated fix  

**Date:** November 27, 2025  
**Status:** ✅ Resolved
