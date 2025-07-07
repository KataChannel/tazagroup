# ⚡ Katadev Quick Start Guide

Hướng dẫn bắt đầu nhanh cho Katadev - Deploy trong 5 phút!

## 🎯 Prerequisites

- Server với Ubuntu 20.04+ hoặc Debian 11+
- SSH access với public key
- Domain name (tùy chọn, cho SSL)

## 🚀 5-Minute Deployment

### Bước 1: Clone và Setup
```bash
# Clone repository
git clone https://github.com/your-org/Katadev.git
cd Katadev

# Cấp quyền thực thi
chmod +x deploy-remote.sh autopush.sh
```

### Bước 2: Deploy Interactive (Khuyến nghị)
```bash
./deploy-remote.sh --interactive
```

Hoặc deploy nhanh:
```bash
# Simple deployment (HTTP only)
./deploy-remote.sh --simple YOUR_SERVER_IP

# Full deployment (HTTPS + SSL)
./deploy-remote.sh YOUR_SERVER_IP YOUR_DOMAIN.COM
```

### Bước 3: Truy cập ứng dụng
- **Frontend**: `https://your-domain.com` hoặc `http://server-ip:3000`
- **API**: `https://api.your-domain.com` hoặc `http://server-ip:3001`
- **Database Admin**: `https://pgadmin.your-domain.com` hoặc `http://server-ip:5050`

## 📝 Git Workflow với autopush.sh

### Push code thường
```bash
# Auto commit và push
./autopush.sh "feat: add new feature"
```

### Merge vào main branch
```bash
# Auto merge với dynamic branch detection
./autopush.sh --merge "release: version 1.0"
```

## 🔍 Kiểm tra sau deploy

### Health Check
```bash
# Kiểm tra services
curl -f http://your-server:3000/health
curl -f http://your-server:3001/health
```

### Xem logs
```bash
ssh root@YOUR_SERVER_IP 'cd /opt/katadev && docker compose logs -f'
```

### Credentials
```bash
# Xem passwords được tạo tự động
ssh root@YOUR_SERVER_IP 'cat /opt/katadev/.env.prod'
```

## 🛠️ Management Commands

```bash
# Restart services
ssh root@SERVER_IP 'cd /opt/katadev && docker compose restart'

# Update deployment
./deploy-remote.sh --force-regen SERVER_IP DOMAIN

# Cleanup deployment
./deploy-remote.sh --cleanup SERVER_IP
```

## 🆘 Troubleshooting

### Lỗi SSH Connection
```bash
# Test SSH connection
ssh -i ~/.ssh/id_rsa root@SERVER_IP

# Generate SSH key if needed
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
ssh-copy-id root@SERVER_IP
```

### Services không start
```bash
# Xem logs chi tiết
ssh root@SERVER_IP 'cd /opt/katadev && docker compose logs'

# Rebuild containers
ssh root@SERVER_IP 'cd /opt/katadev && docker compose down && docker compose up -d --build'
```

### SSL Certificate issues
```bash
# Renew certificates
ssh root@SERVER_IP 'certbot renew --force-renewal'
```

## 📖 Next Steps

- Đọc [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) để hiểu chi tiết
- Tham khảo [API Documentation](docs/api/) 
- Xem [Development Guide](docs/guides/DEVELOPMENT.md)

---

**🎉 Congratulations! Katadev is now running!**  
└── config               # SSH configuration

# SSH Access Commands:
ssh -i ~/.ssh/katadev-deploy root@116.118.85.41
# OR using the auto-generated alias:
ssh katadev-116.118.85.41
```

## 🌐 Access Your Deployed Application

After successful deployment:

```
🌐 Main App:      http://116.118.85.41:3000
🚀 API:          http://116.118.85.41:3001  
📦 MinIO:        http://116.118.85.41:9000
🗄️  pgAdmin:      http://116.118.85.41:5050
```

## 🆘 If Something Goes Wrong

### SSH Issues
```bash
# Fix SSH permissions and connections
./ssh-fix.sh --fix-permissions
./ssh-fix.sh --test-connection 116.118.85.41
```

### Complete Reset
```bash
# Start completely fresh
./ssh-fix.sh --full-reset
./quick-deploy.sh 116.118.85.41
```

## 🎉 Recommended Quick Start

For your specific server `root@116.118.85.41`, just run:

```bash
./quick-deploy.sh 116.118.85.41
```

This single command will:
1. ✅ Generate SSH keys
2. ✅ Deploy keys to your server (password prompt)
3. ✅ Install and configure Katadev
4. ✅ Show access URLs
5. ✅ Set up password-less SSH for future use

**That's it!** No more manual SSH key management or repeated password prompts.

## 📝 All Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `quick-deploy.sh` | 🚀 Complete one-command deployment | `./quick-deploy.sh 116.118.85.41` |
| `auto-ssh-deploy.sh` | 🔑 SSH key generation & deployment | `./auto-ssh-deploy.sh --auto-deploy 116.118.85.41` |
| `deploy-remote.sh` | 🐳 Katadev deployment (enhanced) | `./deploy-remote.sh --simple 116.118.85.41 116.118.85.41` |
| `ssh-fix.sh` | 🔧 SSH troubleshooting | `./ssh-fix.sh --test-connection 116.118.85.41` |
| `ssh-keygen-setup.sh` | 🔐 Advanced SSH key setup | `./ssh-keygen-setup.sh --server 116.118.85.41` |

Choose the approach that works best for you, but `quick-deploy.sh` is recommended for the simplest experience!
