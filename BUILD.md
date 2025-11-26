# 🔨 Build & Deploy - Fresh Code Every Time

## ✨ Key Changes

### Frontend
- ✅ Builds to `.next` (không còn `.next-tazagroup` hoặc `.next-rausach`)
- ✅ Multi-stage build: deps → builder → runtime
- ✅ Fresh build mỗi lần, không cache
- ✅ Build trong Docker, không cần pre-build local

### Backend
- ✅ Fresh install dependencies với `--force`
- ✅ Copy toàn bộ source code mới nhất
- ✅ Không cache, luôn build mới

### Docker Compose
- ✅ `no_cache: true` cho backend và frontend
- ✅ Luôn pull image base mới nhất
- ✅ Build tự động khi deploy

## 🚀 Quick Commands

### Build & Deploy
```bash
# Deploy nhanh lên server (build mới, không cache)
bun deploy:quick

# Build local và start
bun docker:rebuild

# Build riêng lẻ
bun docker:build
```

### Clean & Rebuild
```bash
# Clean tất cả build artifacts và cache
bun clean:build

# Sau đó rebuild
bun docker:rebuild
```

### Development
```bash
# Development mode (không build Docker)
bun dev
bun dev:backend
bun dev:frontend
```

## 📦 Build Process

### Frontend Build Flow
```
1. Install deps (node_modules)
2. Copy source code
3. Run npm run build
   → Generates .next/ directory
4. Copy to runtime image
5. Start with node server.js
```

### Backend Build Flow
```
1. Install deps with --force (no cache)
2. Copy all source code
3. Generate Prisma client
4. Copy to production image
5. Run migrations
6. Start with bun run start:prod
```

## 🔍 Verification

### Check build outputs
```bash
# Frontend build
ls -la frontend/.next/

# Backend build
ls -la backend/dist/
```

### Check Docker images
```bash
docker images | grep tazagroup
```

### Check running containers
```bash
docker compose ps
docker compose logs backend
docker compose logs frontend
```

## 🐛 Troubleshooting

### Build fails
```bash
# Clean everything and rebuild
bun clean:build
bun docker:rebuild
```

### Old code still running
```bash
# Force rebuild without cache
docker compose down
docker compose build --no-cache --pull
docker compose up -d
```

### Cache issues
```bash
# Clean Docker cache
docker builder prune -af
docker image prune -af

# Then rebuild
bun docker:rebuild
```

## 📋 Deploy Checklist

Before deploying:
1. ✅ Code changes committed
2. ✅ Run `bun clean:build` to remove old artifacts
3. ✅ Run `bun deploy:quick` for fresh deploy
4. ✅ Check logs: `docker compose logs -f`

## 🎯 Benefits

- 🚀 **Always Fresh**: Mỗi deploy đều build code mới nhất
- 🔄 **No Cache Issues**: Không bao giờ dùng code cũ cached
- 📦 **Consistent Builds**: Build giống nhau mọi environment
- 🛡️ **Production Ready**: Multi-stage builds tối ưu image size
- 🔍 **Easy Debug**: Rõ ràng code nào đang chạy

## ⚡ Quick Reference

```bash
# Full fresh deploy
bun clean:build && bun deploy:quick

# Local fresh build
bun clean:build && bun docker:rebuild

# Just rebuild (no clean)
bun docker:rebuild

# View logs
bun docker:logs
```
