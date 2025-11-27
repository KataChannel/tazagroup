# 🚀 Full Deployment Workflow

## Tổng quan

Workflow triển khai hoàn chỉnh từ build local → export → deploy server với 3 scripts độc lập:

```
┌─────────────────────┐
│  1. Build Local     │  deploy-1-build-local.sh
│  (Docker images)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  2. Export Images   │  deploy-2-export-images.sh
│  (tar.gz files)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  3. Deploy Server   │  deploy-3-deploy-server.sh
│  (Load & Run)       │
└─────────────────────┘
```

## Scripts

### 1. deploy-1-build-local.sh

**Purpose:** Build Docker images locally with latest code

**What it does:**
- Clean build with `--no-cache --pull`
- Build backend and frontend images
- Tag images as `latest`

**Usage:**
```bash
cd /path/to/project
./scripts/deploy-1-build-local.sh
```

**Output:**
- `tazagroup-backend:latest`
- `tazagroup-frontend:latest`

### 2. deploy-2-export-images.sh

**Purpose:** Export images to tar.gz and copy to server

**What it does:**
- Auto-detect image names from docker compose
- Export images with version and timestamp
- Copy to server via SCP
- Clean up local archives

**Usage:**
```bash
./scripts/deploy-2-export-images.sh
```

**Configuration:**
```bash
VERSION=1.0.0                    # Semantic version
SERVER_USER=root                 # SSH user
SERVER_HOST=116.118.49.243       # Server IP
SERVER_PATH=/root/tazagroup      # Deploy directory
```

**Output on server:**
```
/root/tazagroup/
  ├── backend-1.0.0-20251126_182000.tar.gz   (198M)
  └── frontend-1.0.0-20251126_182000.tar.gz  (83M)
```

### 3. deploy-3-deploy-server.sh

**Purpose:** Load images and deploy containers on server

**What it does:**
- Find latest tar.gz files
- Load images with `docker load`
- Stop old containers
- Start new containers with docker run
- Use host networking
- Configure environment variables

**Usage on server:**
```bash
ssh root@116.118.49.243
cd /root/tazagroup
./deploy-3-deploy-server.sh
```

**Or remotely:**
```bash
./scripts/deploy-3-deploy-server.sh local
```

**Configuration:**
Uses environment variables for:
- Database connection (PostgreSQL 12003)
- Redis connection (port 12004, no password)
- Minio connection (port 12007)
- Domain and SSL settings
- OAuth credentials

## Complete Workflow

### Option A: Run individual scripts

```bash
# Step 1: Build
./scripts/deploy-1-build-local.sh

# Step 2: Export and copy
./scripts/deploy-2-export-images.sh

# Step 3: Deploy on server
ssh root@116.118.49.243 "cd /root/tazagroup && ./deploy-3-deploy-server.sh"
```

### Option B: Use deploy-complete.sh

```bash
./scripts/deploy-complete.sh
```

The complete script will:
1. Prompt for server details
2. Execute all 3 steps sequentially
3. Show progress and status
4. Verify deployment

## Infrastructure Requirements

### Shared Services (Must exist)
- **PostgreSQL:** Port 12003, Database `tazagroupcore`
- **Redis:** Port 12004, no password
- **Minio:** Port 12007, credentials minio-admin/minio-secret-2025

### Application Ports (Will be used)
- **Backend:** Port 13001
- **Frontend:** Port 13000

### Domains (Must be configured in nginx)
- `app.tazagroup.vn` → localhost:13000
- `appapi.tazagroup.vn` → localhost:13001
- `storage.tazagroup.vn` → localhost:12007

## Environment Variables

### Backend

**Network & Docker:**
- `NODE_ENV=production`
- `PORT=13001`
- `DOCKER_NETWORK_NAME=host`

**Redis:**
- `DOCKER_REDIS_HOST=127.0.0.1`
- `DOCKER_REDIS_PORT=12004`

**Minio:**
- `DOCKER_MINIO_ENDPOINT=127.0.0.1`
- `DOCKER_MINIO_PORT=12007`
- `MINIO_INTERNAL_ENDPOINT=127.0.0.1`
- `MINIO_INTERNAL_PORT=12007`
- `MINIO_INTERNAL_SSL=false`
- `MINIO_ENDPOINT=storage.tazagroup.vn`
- `MINIO_PORT=443`
- `MINIO_PUBLIC_ENDPOINT=storage.tazagroup.vn`
- `MINIO_USE_SSL=false`
- `MINIO_ACCESS_KEY=minio-admin`
- `MINIO_SECRET_KEY=minio-secret-2025`
- `MINIO_BUCKET_NAME=tazagroup-uploads`

**Database:**
- `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:12003/tazagroupcore`

**Application:**
- `DOMAIN=tazagroup.vn`
- `SSL_EMAIL=admin@tazagroup.vn`
- `FRONTEND_URL=https://app.tazagroup.vn`
- `JWT_SECRET=11112222333344445555666677778888`
- `JWT_EXPIRES_IN=7d`

**OAuth:**
- `NEXTAUTH_SECRET=your-nextauth-secret`
- `NEXTAUTH_URL=https://app.tazagroup.vn`
- `GOOGLE_CLIENT_ID=your-google-client-id`
- `GOOGLE_CLIENT_SECRET=your-google-client-secret`

### Frontend

**Network:**
- `NODE_ENV=production`
- `PORT=13000`

**API URLs:**
- `NEXT_PUBLIC_API_URL=https://appapi.tazagroup.vn`
- `NEXT_PUBLIC_WS_URL=wss://appapi.tazagroup.vn`
- `NEXT_PUBLIC_GRAPHQL_URL=https://appapi.tazagroup.vn/graphql`
- `NEXT_PUBLIC_GRAPHQL_WS_URL=wss://appapi.tazagroup.vn/graphql`
- `NEXT_PUBLIC_STORAGE_URL=https://storage.tazagroup.vn`

**OAuth:**
- `NEXTAUTH_URL=https://app.tazagroup.vn`
- `NEXTAUTH_SECRET=your-nextauth-secret`
- `GOOGLE_CLIENT_ID=your-google-client-id`
- `GOOGLE_CLIENT_SECRET=your-google-client-secret`

## Troubleshooting

### Build fails
```bash
# Clean Docker cache
docker system prune -a --volumes

# Rebuild
./scripts/deploy-1-build-local.sh
```

### Export fails - Images not found
```bash
# List images
docker images | grep tazagroup

# Check docker-compose.yml has correct service names
docker compose config
```

### Deploy fails - Cannot connect to services

**Check services are running:**
```bash
ssh root@116.118.49.243 "docker ps | grep -E 'postgres|redis|minio'"
```

**Check ports are open:**
```bash
ssh root@116.118.49.243 "netstat -tlnp | grep -E '12003|12004|12007'"
```

**Test connectivity:**
```bash
# PostgreSQL
ssh root@116.118.49.243 "docker exec shoppostgres psql -U postgres -d tazagroupcore -c 'SELECT 1'"

# Redis
ssh root@116.118.49.243 "docker exec shared-redis redis-cli PING"

# Minio
ssh root@116.118.49.243 "curl -I http://localhost:12007/minio/health/live"
```

### Backend container starts but unhealthy

**Check logs:**
```bash
ssh root@116.118.49.243 "docker logs tazagroup-backend --tail 100"
```

**Common issues:**
- Missing `DOCKER_NETWORK_NAME` env var
- Missing `DOCKER_REDIS_HOST` and `DOCKER_REDIS_PORT`
- Missing `DOCKER_MINIO_ENDPOINT` and `DOCKER_MINIO_PORT`
- Database connection string incorrect
- Redis password configured when shouldn't be

**Test manually:**
```bash
# Enter container
ssh root@116.118.49.243 "docker exec -it tazagroup-backend sh"

# Test connections
nc -zv 127.0.0.1 12003  # PostgreSQL
nc -zv 127.0.0.1 12004  # Redis
nc -zv 127.0.0.1 12007  # Minio

# Check env vars
env | grep -E 'DOCKER|REDIS|MINIO|DATABASE'
```

### Frontend container starts but unhealthy

**Check logs:**
```bash
ssh root@116.118.49.243 "docker logs tazagroup-frontend --tail 100"
```

**Test frontend:**
```bash
curl http://localhost:13000
```

### Healthcheck shows unhealthy but app works

This is a known issue: Dockerfile healthcheck uses port 4000 (default) but containers run on 13001/13000.

**Temporary solution:** Ignore healthcheck status if API/frontend responds correctly

**Permanent solution:** Override healthcheck when deploying:
```bash
docker run ... \
  --health-cmd 'curl -f http://localhost:13001/health || exit 1' \
  tazagroup-backend
```

Or update Dockerfile to use `PORT` env var in healthcheck.

## Verification

### 1. Check containers running
```bash
ssh root@116.118.49.243 "docker ps | grep tazagroup"
```

### 2. Test backend API
```bash
curl https://appapi.tazagroup.vn/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{__typename}"}'
```

### 3. Test frontend
```bash
curl -I https://app.tazagroup.vn
```

### 4. Test storage
```bash
curl -I https://storage.tazagroup.vn
```

### 5. Check logs
```bash
ssh root@116.118.49.243 "docker logs tazagroup-backend --tail 50"
ssh root@116.118.49.243 "docker logs tazagroup-frontend --tail 50"
```

## Rollback

If deployment fails, rollback to previous version:

```bash
ssh root@116.118.49.243

# Stop new containers
docker stop tazagroup-backend tazagroup-frontend
docker rm tazagroup-backend tazagroup-frontend

# Find previous images
docker images | grep tazagroup

# Start previous version
docker run -d --name tazagroup-backend ... tazagroup-backend:1.0.0-OLD_TIMESTAMP
docker run -d --name tazagroup-frontend ... tazagroup-frontend:1.0.0-OLD_TIMESTAMP
```

## Best Practices

1. **Always test locally first** before deploying to production
2. **Tag images with version and timestamp** for easy rollback
3. **Keep old images** on server for at least 3 deployments
4. **Backup database** before major updates
5. **Monitor logs** for first 10 minutes after deployment
6. **Test all critical features** after deployment
7. **Document any manual changes** made during deployment

## Security Notes

⚠️ **Change these in production:**
- `NEXTAUTH_SECRET` - Generate new secret
- `JWT_SECRET` - Generate new secret
- `GOOGLE_CLIENT_SECRET` - Use production OAuth app
- Redis password - Configure if needed
- Database password - Use strong password

## Performance Tips

1. **Image size optimization:**
   - Use multi-stage builds
   - Remove dev dependencies
   - Optimize layer caching

2. **Build optimization:**
   - Cache node_modules in CI/CD
   - Use BuildKit for parallel builds
   - Skip unnecessary rebuilds

3. **Deploy optimization:**
   - Compress tar.gz with pigz (parallel gzip)
   - Use rsync instead of scp for incremental transfers
   - Keep previous images on server to skip re-transfer

## CI/CD Integration

This workflow can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
deploy:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Build images
      run: ./scripts/deploy-1-build-local.sh
    
    - name: Export and deploy
      run: |
        ./scripts/deploy-2-export-images.sh
        ssh ${{ secrets.SERVER_HOST }} "cd /root/tazagroup && ./deploy-3-deploy-server.sh"
    
    - name: Verify deployment
      run: |
        curl -f https://appapi.tazagroup.vn/graphql -d '{"query":"{__typename}"}'
```

## Support

For issues or questions:
1. Check logs first: `docker logs tazagroup-backend`
2. Review this README
3. Check DEPLOYMENT_SUCCESS_OPTION_16.md for successful deployment example
4. Create issue with logs and error messages
