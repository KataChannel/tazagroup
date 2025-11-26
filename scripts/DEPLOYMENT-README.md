# 🚀 TazaGroup Deployment System

## Tổng quan

Hệ thống deployment được tối ưu hóa để giảm tải cho server bằng cách:
1. ✅ Build Docker images trên máy local (máy mạnh)
2. ✅ Export và copy images lên server
3. ✅ Deploy containers trên server từ pre-built images
4. ✅ Cleanup resources tự động

## Lợi ích

### 🎯 Giảm tải server
- Build images trên máy local thay vì trên server
- Server chỉ cần load và run pre-built images
- Tiết kiệm CPU, RAM, và disk I/O trên server

### ⚡ Nhanh hơn
- Build song song trên máy mạnh
- Không phải compile trên server yếu
- Deploy nhanh chóng chỉ với `docker load`

### 🔒 An toàn hơn
- Test images trước khi deploy
- Rollback dễ dàng với image tags
- Không ảnh hưởng đến production khi build

### 📦 Tối ưu băng thông
- Compress images trước khi transfer
- Sử dụng rsync để resume nếu bị ngắt
- Chỉ transfer images cần thiết

## Cấu trúc Scripts

```
scripts/
├── deploy-complete.sh           # Script tổng hợp (chạy toàn bộ pipeline)
├── deploy-1-build-local.sh     # Build images trên local
├── deploy-2-export-images.sh   # Export và copy lên server
├── deploy-3-deploy-server.sh   # Deploy trên server
└── deploy-4-cleanup.sh         # Cleanup resources
```

## Sử dụng

### 🚀 Quick Start - Deploy hoàn chỉnh

```bash
# Chạy toàn bộ pipeline (recommended)
./scripts/deploy-complete.sh
```

Script sẽ hướng dẫn bạn qua từng bước:
1. Nhập thông tin server
2. Build images
3. Export và copy
4. Deploy
5. Cleanup (optional)

### 📋 Chi tiết từng bước

#### Bước 1: Build Images Locally

```bash
./scripts/deploy-1-build-local.sh
```

**Yêu cầu:**
- Docker đang chạy
- Frontend đã được build (`.next-tazagroup` exists)
- Backend đã được build (`backend/dist` exists)

**Output:**
- Backend image: `tazagroup-backend:VERSION-TIMESTAMP`
- Frontend image: `tazagroup-frontend:VERSION-TIMESTAMP`
- File `.docker-image-tags` chứa thông tin images

#### Bước 2: Export và Copy lên Server

```bash
./scripts/deploy-2-export-images.sh
```

**Yêu cầu:**
- SSH access đến server
- Đủ disk space cho export (~500MB-1GB)
- Đủ bandwidth cho upload

**Process:**
1. Export images sang file `.tar.gz`
2. Compress để giảm kích thước
3. Copy lên server qua SSH/rsync
4. Copy các file config cần thiết

**Output:**
- Images được copy vào `~/tazagroup-deploy/` trên server

#### Bước 3: Deploy trên Server

```bash
# Chạy từ local (recommended)
./scripts/deploy-3-deploy-server.sh local

# Hoặc chạy trực tiếp trên server
ssh user@server
cd ~/tazagroup-deploy
./deploy-3-deploy-server.sh
```

**Process:**
1. Load images vào Docker
2. Update docker-compose với image tags
3. Stop containers cũ
4. Start containers mới
5. Verify deployment

#### Bước 4: Cleanup

```bash
# Cleanup local machine
./scripts/deploy-4-cleanup.sh local

# Cleanup server
./scripts/deploy-4-cleanup.sh server
```

**Cleanup includes:**
- Dangling images
- Old TazaGroup images (keep latest)
- Stopped containers
- Unused volumes
- Build cache
- Unused networks

## Configuration

### Environment Variables

```bash
# Server configuration
export SERVER_USER="it"
export SERVER_HOST="116.118.49.243"
export SERVER_PATH="/home/it/tazagroup-deploy"
```

### Docker Images

Images được tag theo format:
```
tazagroup-backend:VERSION-TIMESTAMP
tazagroup-frontend:VERSION-TIMESTAMP
```

Ví dụ:
```
tazagroup-backend:1.0.0-20251126_103000
tazagroup-frontend:1.0.0-20251126_103000
```

## Troubleshooting

### Build Failed

```bash
# Check Docker
docker info

# Check frontend build
cd frontend && ls -la .next-tazagroup

# Rebuild frontend
cd frontend && bun run build:tazagroup

# Check backend build
cd backend && ls -la dist

# Rebuild backend
cd backend && bun run build
```

### Copy Failed

```bash
# Test SSH connection
ssh user@server

# Check disk space on server
ssh user@server 'df -h'

# Check network
ping server-ip

# Manual copy if rsync fails
scp -r docker-images-export/* user@server:~/tazagroup-deploy/
```

### Deploy Failed

```bash
# Check containers
ssh user@server 'docker ps -a'

# Check logs
ssh user@server 'cd ~/tazagroup-deploy && docker-compose -f docker-compose.deploy.yml logs'

# Restart services
ssh user@server 'cd ~/tazagroup-deploy && docker-compose -f docker-compose.deploy.yml restart'
```

### Cleanup Issues

```bash
# Check what's using space
docker system df

# Safe cleanup (recommended)
docker image prune -f
docker container prune -f

# Aggressive cleanup (removes everything unused)
docker system prune -a -f --volumes
```

## Best Practices

### 🎯 Trước khi Deploy

- [ ] Test changes locally first
- [ ] Update VERSION file
- [ ] Commit và push code
- [ ] Backup database nếu có migration
- [ ] Notify team về deployment

### 🚀 Trong quá trình Deploy

- [ ] Monitor build progress
- [ ] Verify image sizes (không quá lớn)
- [ ] Check upload progress
- [ ] Verify deployment health checks
- [ ] Test application endpoints

### ✅ Sau khi Deploy

- [ ] Verify frontend: http://server:13000
- [ ] Verify backend: http://server:13001/health
- [ ] Check logs cho errors
- [ ] Test core functionality
- [ ] Cleanup old resources

## Performance Tips

### 💪 Optimize Build Time

```bash
# Use BuildKit
export DOCKER_BUILDKIT=1

# Use cache
docker build --cache-from tazagroup-backend:latest ...

# Parallel builds
# Build backend và frontend đồng thời trong 2 terminals
```

### 📦 Reduce Image Size

- Multi-stage builds (đã implement)
- Alpine base images (đã implement)
- Remove dev dependencies
- Optimize layer caching

### 🌐 Optimize Transfer

```bash
# Use rsync thay vì scp
rsync -avz --progress ...

# Compress better
docker save image | gzip -9 > image.tar.gz

# Use faster compression
docker save image | pigz > image.tar.gz
```

## Security

### 🔒 Server Access

- Sử dụng SSH keys thay vì passwords
- Restrict SSH access
- Use non-root user

### 🛡️ Docker Security

- Run containers as non-root (đã implement)
- Limit container resources (đã implement)
- Use private registry for images (optional)
- Scan images for vulnerabilities

## Rollback

### 🔄 Rollback to Previous Version

```bash
# On server
cd ~/tazagroup-deploy

# Stop current
docker-compose -f docker-compose.deploy.yml down

# Load old images
docker load -i backup/backend-VERSION.tar.gz
docker load -i backup/frontend-VERSION.tar.gz

# Update compose and start
docker-compose -f docker-compose.deploy.yml up -d
```

## Monitoring

### 📊 Check Application Health

```bash
# Container status
docker-compose -f docker-compose.deploy.yml ps

# Resource usage
docker stats

# Logs
docker-compose -f docker-compose.deploy.yml logs -f

# Health checks
curl http://server:13001/health
curl http://server:13000/
```

## Support

### 📚 Documentation

- [Main README](../README.md)
- [Docker Compose Configuration](../docker-compose.yml)
- [Deployment Guide](../docs/05-DEPLOYMENT.md)

### 🐛 Issues

Report issues tại: [GitHub Issues](https://github.com/KataChannel/tazagroup/issues)

### 💬 Contact

- Email: support@tazagroup.vn
- Website: https://tazagroup.vn

---

**Made with ❤️ by TazaGroup Team**
