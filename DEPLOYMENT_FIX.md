# Fix Deployment Scripts

## Vấn đề
Script `deploy-complete.sh` (option 16 trong dev menu) không hoạt động vì:
- Sử dụng workflow cũ (build local → export → deploy)
- Dựa vào `.docker-image-tags` file không còn được tạo
- Dựa vào `.next-tazagroup` directory đã bỏ (build system mới dùng `.next`)
- Sử dụng `docker-compose.deploy.yml` không tồn tại

## Giải pháp

### 1. Đơn giản hóa `deploy-complete.sh`
Thay vì workflow phức tạp 4 bước, giờ chỉ gọi `quick-deploy-server.sh`:
```bash
deploy-complete.sh → quick-deploy-server.sh
```

**Lợi ích:**
- Đơn giản hơn, ít lỗi hơn
- Build trực tiếp trên server (nhanh hơn, không phải export/import images)
- Dùng `docker compose build --no-cache --pull` cho fresh builds

### 2. Cập nhật `quick-deploy-server.sh`
- Sửa `docker-compose` → `docker compose` (Docker Compose V2)
- Sửa path: `/root/tazagroup-deploy` → `/root/tazagroup`
- Thêm excludes: `.next`, `dist`, `docker-images-export`

### 3. Cập nhật `deploy-1-build-local.sh`
Thay vì build thủ công, giờ dùng docker-compose:
```bash
docker compose build --no-cache --pull backend frontend
```

**Loại bỏ:**
- Kiểm tra `.next-tazagroup` directory
- Build frontend/backend riêng lẻ
- Tạo `.docker-image-tags` file
- Sử dụng `Dockerfile.tazagroup` (giờ dùng `Dockerfile` chung)

### 4. Cập nhật `deploy-2-export-images.sh`
- Bỏ dependency vào `.docker-image-tags`
- Lấy image names từ `docker compose config`
- Sử dụng timestamp thay vì IMAGE_TAG

### 5. Cập nhật `vscode-menu.sh`
Thêm các options mới:
- **Option 17:** `docker:build` - Build without cache
- **Option 18:** `docker:rebuild` - Down + Build + Up
- **Option 19:** `docker:fresh` - Clean volumes + Build + Up
- **Option 20:** `clean:build` - Clean all build artifacts
- **Option 21:** `deploy:quick` - Quick deploy to server

## Workflow mới

### Deploy Complete (Option 16)
```
1. Rsync code lên server
2. Build trên server: docker compose build --no-cache --pull
3. Deploy: docker compose up -d
```

### Deploy Quick (Option 21)
```
Giống Option 16 (đều dùng quick-deploy-server.sh)
```

## Kết quả
✅ Tất cả deployment scripts đã được cập nhật và tương thích với build system mới
✅ Loại bỏ references đến `.next-tazagroup`, `.docker-image-tags`
✅ Sử dụng Docker Compose V2 syntax (`docker compose`)
✅ Đường dẫn server đúng: `/root/tazagroup`
✅ Fresh builds với `--no-cache --pull`
✅ Dev menu có đầy đủ options cho docker operations

## Testing
```bash
# Test syntax
bash -n scripts/deploy-complete.sh
bash -n scripts/quick-deploy-server.sh
bash -n scripts/deploy-1-build-local.sh

# Test menu
bun dev
# Chọn option 16 hoặc 21
```
