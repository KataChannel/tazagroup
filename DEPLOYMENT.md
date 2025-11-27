# TazaGroup Deployment Guide

## 🚀 Quick Start

### Local Development
```bash
# Start development servers
bun dev

# Or specific services
bun dev:backend
bun dev:frontend
```

### Docker Deployment

#### Option 1: Quick Deploy (Recommended)
```bash
# Deploy everything to server in one command
bun deploy:quick
```

#### Option 2: Step by Step
```bash
# Start all services (Postgres, Redis, Minio, Backend, Frontend)
bun docker:up

# Check status
bun docker:ps

# View logs
bun docker:logs

# Stop all services
bun docker:down

# Rebuild and restart
bun docker:rebuild
```

#### Option 3: Using Scripts
```bash
# Deploy TazaGroup stack
./scripts/deploy-tazagroup.sh up
./scripts/deploy-tazagroup.sh down
./scripts/deploy-tazagroup.sh restart
./scripts/deploy-tazagroup.sh logs
./scripts/deploy-tazagroup.sh status
./scripts/deploy-tazagroup.sh rebuild
```

## 📦 Services & Ports

### TazaGroup Domain (Port 13xxx)
- **Frontend**: http://116.118.49.243:13000 → https://app.tazagroup.vn
- **Backend API**: http://116.118.49.243:13001 → https://appapi.tazagroup.vn
- **PostgreSQL**: 116.118.49.243:13003

### Shared Services (Port 12xxx)
- **Redis**: 116.118.49.243:12004
- **Minio S3**: 116.118.49.243:12007
- **Minio Console**: http://116.118.49.243:12008
- **Storage**: https://storage.tazagroup.vn

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TazaGroup Stack                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (13000)  ←→  Backend (13001)  ←→  Postgres (13003)│
│         ↓                    ↓                               │
│         └──────→  Redis (12004)  ←──────┘                   │
│                     Minio (12007)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration

### Environment Variables
All configuration is in `.env` file:
- Database connection: `DATABASE_URL`
- Redis connection: `REDIS_HOST`, `REDIS_PORT`
- Minio storage: `MINIO_*` variables
- Domain URLs: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GRAPHQL_ENDPOINT`

### Docker Compose
Main configuration file: `docker-compose.yml`
- Defines all services
- Sets up networking
- Configures resource limits
- Manages volumes

## 📋 Common Commands

### Development
```bash
bun dev                    # Interactive menu
bun dev:backend           # Backend only
bun dev:frontend          # Frontend only
```

### Docker Operations
```bash
bun docker:up             # Start all services
bun docker:down           # Stop all services
bun docker:logs           # View logs
bun docker:ps             # Show status
bun docker:restart        # Restart services
bun docker:rebuild        # Full rebuild
```

### Deployment
```bash
bun deploy:quick          # Quick deploy to server
bun deploy:tazagroup      # Deploy stack
bun deploy:tazagroup:logs # View logs
```

### Database Operations
```bash
bun db:migrate            # Run migrations
bun db:studio             # Open Prisma Studio
bun db:push               # Push schema changes
```

## 🔍 Monitoring

### Check Service Health
```bash
# On server
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend

# Check endpoints
curl -I https://app.tazagroup.vn
curl -I https://appapi.tazagroup.vn/health
```

### Resource Usage
```bash
docker stats
docker system df
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check logs
docker compose logs backend

# Common issues:
# - Database not ready: wait 30s and restart
# - Redis connection: check REDIS_HOST in .env
# - Port conflict: ensure 13001 is free
```

### Frontend won't start
```bash
# Check logs
docker compose logs frontend

# Common issues:
# - Backend not ready: wait for backend
# - Build failed: rebuild with --no-cache
# - Port conflict: ensure 13000 is free
```

### Database connection issues
```bash
# Check PostgreSQL
docker compose exec postgres psql -U postgres -d tazagroupcore

# Test connection
psql "postgresql://postgres:postgres@116.118.49.243:13003/tazagroupcore"
```

### CORS errors
```bash
# Check nginx configuration
ssh root@116.118.49.243 'nginx -t'
ssh root@116.118.49.243 'systemctl status nginx'

# Test CORS
curl -X OPTIONS https://appapi.tazagroup.vn/graphql \
  -H "Origin: https://app.tazagroup.vn" -I
```

## 🔐 SSL Certificates

### Setup SSL
```bash
# For API domain
./scripts/setup-ssl-appapi.sh

# For app domain
./scripts/setup-ssl-tazagroup.sh
```

### Update CORS (after SSL)
```bash
./scripts/fix-cors-https.sh
```

## 📚 Additional Resources

- [Deployment Scripts](./scripts/)
- [Docker Compose Config](./docker-compose.yml)
- [Environment Variables](./.env)
- [Nginx Configuration](./nginx/)

## 🆘 Support

For issues or questions:
1. Check logs: `bun docker:logs`
2. Check status: `bun docker:ps`
3. Review this guide
4. Check nginx configuration on server
