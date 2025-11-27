# Fix Deployment Scripts - Build Local → Export → Deploy

## Vấn đề  
Script `deploy-complete.sh` (option 16) không hoạt động vì:
- Dựa vào `.docker-image-tags` file không còn được tạo
- Dựa vào `.next-tazagroup` directory đã bỏ (build system mới dùng `.next`)
- Sử dụng `docker-compose.deploy.yml` không tồn tại
- Logic cũ không tương thích với build system mới

## Giải pháp - Khôi phục quy trình đầy đủ

### 1. Cập nhật `deploy-complete.sh`
Khôi phục workflow 4 bước đầy đủ:
```bash
Step 1: Build images locally (deploy-1-build-local.sh)
Step 2: Export and copy to server (deploy-2-export-images.sh)  
Step 3: Deploy on server (deploy-3-deploy-server.sh)
Step 4: Cleanup (optional)
```

**Lợi ích:**
- Build một lần ở local (không cần build lại trên server yếu)
- Export image rồi load trên server (nhanh hơn build trên server)
- Giảm tải CPU/RAM server khi build

### 2. Cập nhật `deploy-1-build-local.sh`
Build với docker-compose (không cache):
```bash
docker compose build --no-cache --pull backend frontend
```

**Loại bỏ:**
- Kiểm tra `.next-tazagroup` directory  
- Build frontend/backend riêng lẻ
- Tạo `.docker-image-tags` file
- Logic build cũ với Dockerfile.tazagroup

### 3. Cập nhật `deploy-2-export-images.sh`
Export images đã build:
- Lấy image names từ `docker compose config`
- Export thành tar.gz với timestamp
- Copy lên server qua rsync/scp

### 4. Cập nhật `deploy-3-deploy-server.sh`
Deploy trên server:
- Tìm file tar.gz mới nhất (backend-*.tar.gz, frontend-*.tar.gz)
- Load images: `gunzip -c *.tar.gz | docker load`
- Deploy: `docker compose up -d backend frontend`
- Verify deployment

**Loại bỏ:**
- docker-compose.deploy.yml (dùng docker-compose.yml hiện có)
- .docker-image-tags dependency
- Logic deploy cũ

### 5. Cập nhật `quick-deploy-server.sh` (Option 21)
Workflow khác - build trên server:
- Sửa `docker-compose` → `docker compose`
- Sửa path: `/root/tazagroup-deploy` → `/root/tazagroup`
- Excludes: `.next`, `dist`, `docker-images-export`

## Workflow mới

### Deploy Complete (Option 16) - Build Local
```
1. docker compose build --no-cache --pull (LOCAL)
2. docker save → tar.gz
3. rsync/scp lên server
4. docker load < tar.gz (SERVER)
5. docker compose up -d (SERVER)
```

**Ưu điểm:**
- Build mạnh ở local, server chỉ load image
- Tiết kiệm tài nguyên server
- Phù hợp server yếu

### Deploy Quick (Option 21) - Build Server  
```
1. rsync code lên server
2. docker compose build --no-cache --pull (SERVER)
3. docker compose up -d (SERVER)
```

**Ưu điểm:**
- Nhanh hơn (không export/import)
- Phù hợp server mạnh
- Đơn giản hơn

## Kết quả
✅ Option 16: Build local → Export → Copy → Deploy (quy trình đầy đủ)
✅ Option 21: Quick deploy (build trên server)
✅ Loại bỏ .docker-image-tags, .next-tazagroup
✅ Sử dụng Docker Compose V2 (`docker compose`)
✅ Đường dẫn: `/root/tazagroup`
✅ Fresh builds với `--no-cache --pull`

## Testing
```bash
# Test syntax
bash -n scripts/deploy-complete.sh
bash -n scripts/deploy-1-build-local.sh
bash -n scripts/deploy-2-export-images.sh
bash -n scripts/deploy-3-deploy-server.sh

# Test deploy
bun dev
# Option 16: Full workflow (build local)
# Option 21: Quick deploy (build server)
```
