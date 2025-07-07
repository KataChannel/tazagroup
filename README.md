# 🚀 Katadev - Advanced Full-Stack Development Platform

<div align="center">

![Katadev Logo](https://via.placeholder.com/200x80/4A90E2/FFFFFF?text=Katadev)

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/your-org/Katadev)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://docker.com)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**Nền tảng phát triển full-stack hiện đại với Next.js, NestJS, và Docker**

[🚀 Quick Start](#quick-start) •
[📖 Documentation](#documentation) •
[🛠️ Development](#development) •
[🚢 Deployment](#deployment) •
[🤝 Contributing](#contributing)

</div>

## ✨ Tính năng nổi bật

- 🎯 **Full-Stack TypeScript**: Next.js + NestJS + Prisma
- 🐳 **Docker Ready**: Production-ready containerization
- 🚀 **Auto Deployment**: Automated deployment scripts với SSL
- 📱 **Responsive Design**: Mobile-first responsive UI
- 🔐 **Authentication**: JWT-based auth với role management
- 🗄️ **Database**: PostgreSQL với Prisma ORM
- 📊 **Monitoring**: Built-in health checks và logging
- 🔄 **CI/CD**: Automated Git workflow
- 🌐 **Multi-Environment**: Dev, Staging, Production configs

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────┐    ┌─────────────────┐
         │   Redis Cache   │    │   MinIO S3      │
         │   Port: 6379    │    │   Port: 9000    │
         └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start Scripts

Katadev includes powerful automation scripts to streamline your development and deployment workflow.

### 🔧 Main Deployment Script (`deploy-remote.sh`)

Deploy your application to any server with a single command:

```bash
# Interactive deployment (recommended for beginners)
chmod +x deploy-remote.sh
./deploy-remote.sh --interactive

# Quick full deployment with SSL
./deploy-remote.sh 116.118.48.143 yourdomain.com

# Simple deployment (no SSL, IP only)
./deploy-remote.sh --simple 192.168.1.100

# Production deployment with all services
./deploy-production.sh 116.118.48.143 yourdomain.com
```

**Features:**
- ✅ **One-click deployment** to any Linux server
- ✅ **Automatic SSL** with Let's Encrypt certificates
- ✅ **Dynamic service configuration** (API, Database, Redis, MinIO, etc.)
- ✅ **Health checks** and monitoring
- ✅ **Interactive mode** for beginners
- ✅ **Cleanup and rollback** capabilities

### 🔄 Git Automation Script (`autopush.sh`)

Automate your Git workflow with smart commit messages and branch management:

```bash
# Auto-commit and push with smart messages
chmod +x autopush.sh
./autopush.sh

# Merge current branch to main with auto-detection
./autopush.sh --merge

# Custom commit message
./autopush.sh "feat: add user authentication system"

# Merge to specific branch
./autopush.sh --main-branch develop --merge "release: v2.1.0"
```

**Features:**
- ✅ **Smart commit messages** based on file changes
- ✅ **Dynamic main branch detection** (main/master/develop/dev)
- ✅ **Automatic merging** with conflict handling
- ✅ **Branch cleanup** after merge
- ✅ **Change analysis** and file type detection

### 📖 Complete Documentation

| Document | Description |
|----------|-------------|
| **[🚀 Deployment Guide](DEPLOYMENT-README.md)** | Complete deployment instructions, configurations, and troubleshooting |
| **[🔄 AutoPush Guide](AUTOPUSH-README.md)** | Git automation documentation with examples |
| **[📚 Full Documentation](docs/)** | Comprehensive project documentation and API references |
| **[🏗️ Architecture Guide](docs/guides/ARCHITECTURE.md)** | System architecture and design patterns |
| **[⚙️ Development Guide](docs/guides/DEVELOPMENT.md)** | Local development setup and guidelines |

## 🛠️ Prerequisites

Before using the deployment scripts, ensure you have:

- **Server Access**: SSH access to a Linux server (Ubuntu 20.04+ recommended)
- **Domain Name**: For SSL deployment (optional for simple deployment)
- **SSH Keys**: Properly configured SSH key authentication
- **Git Repository**: Your code should be in a Git repository

## 🌟 Key Features at a Glance

| Feature | Description | Script |
|---------|-------------|--------|
| **One-Click Deploy** | Deploy entire stack to any server | `deploy-remote.sh` |
| **Auto SSL** | Automatic Let's Encrypt certificates | `deploy-remote.sh --full` |
| **Smart Commits** | AI-powered commit message generation | `autopush.sh` |
| **Branch Management** | Automatic merge and cleanup | `autopush.sh --merge` |
| **Health Monitoring** | Built-in service health checks | All deployment scripts |
| **Multi-Environment** | Support for dev/staging/production | `deploy-production.sh` |
| **Interactive Mode** | Guided setup for beginners | `--interactive` flag |
| **Cleanup Tools** | Safe removal and rollback | `--cleanup` flag |

## 📋 Overview

**Katadev** là nền tảng phát triển full-stack hiện đại được thiết kế để đơn giản hóa quy trình phát triển và triển khai ứng dụng web. Với hai script tự động hóa chính `deploy-remote.sh` và `autopush.sh`, Katadev giúp developers tập trung vào việc phát triển tính năng thay vì lo lắng về infrastructure.

### 🎯 What Makes Katadev Special

- **🏢 Complete HRM System** - Full-featured Human Resource Management with employee lifecycle, departments, and role-based access
- **🚀 One-Command Deployment** - Deploy to any server with automated SSL, Docker orchestration, and environment setup  
- **⚡ Ultra-Fast Development** - Bun.js runtime with Turbopack for lightning-fast builds and hot reloading
- **🔒 Enterprise Security** - JWT authentication, role-based permissions, and automated security configurations
- **🐳 Cloud-Ready Architecture** - Containerized services with PostgreSQL, Redis, MinIO, and monitoring

### ⚡ Quick Deploy Example

Deploy your full-stack application in under 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/KataChannel/Katadev.git
cd Katadev

# 2. Deploy to your server (replace with your details)
chmod +x deploy-remote.sh
./deploy-remote.sh 116.118.48.143 myapp.com

# 3. Your application is now live! 🎉
```

**What you get instantly:**
- 🌐 **Frontend**: `https://myapp.com` - Next.js application
- 🚀 **API**: `https://api.myapp.com` - NestJS backend  
- 📊 **Database Admin**: `https://pgadmin.myapp.com` - pgAdmin interface
- 📦 **Storage**: `https://minio.myapp.com` - Object storage
- 🔒 **SSL Certificates** - Automatic Let's Encrypt setup
- 🛡️ **Security** - Firewall, authentication, and secure configurations

All services are automatically configured, secured, and monitored!

---

## 🚀 Quick Start

### 1. Clone & Setup

```bash
# Clone repository
git clone https://github.com/your-org/Katadev.git
cd Katadev

# Cấp quyền thực thi cho scripts
chmod +x deploy-remote.sh autopush.sh

# Copy environment file
cp .env.example .env
```

### 2. Local Development

```bash
# Start với Docker Compose
docker compose up -d

# Hoặc development mode
cd site && npm run dev    # Frontend: http://localhost:3000
cd api && npm run dev     # Backend: http://localhost:3001
```

### 3. Production Deployment

```bash
# Interactive deployment (khuyến nghị cho lần đầu)
./deploy-remote.sh --interactive

# Quick deployment
./deploy-remote.sh YOUR_SERVER_IP YOUR_DOMAIN.COM

# Simple deployment (no SSL)
./deploy-remote.sh --simple YOUR_SERVER_IP
```

## 🛠️ Development

### Tech Stack

#### Frontend (site/)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **State Management**: React Context + Hooks
- **Auth**: NextAuth.js

#### Backend (api/)
- **Framework**: NestJS
- **Language**: TypeScript  
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: JWT + Passport
- **Validation**: Class Validator

#### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (production)
- **SSL**: Let's Encrypt (automatic)
- **Storage**: MinIO (S3-compatible)
- **Monitoring**: Built-in health checks

---

## 🏗️ Technology Stack

<table>
<tr>
<td><strong>Frontend</strong></td>
<td>Next.js 15, React 19, TypeScript, Tailwind CSS 4, Material-UI</td>
</tr>
---

## 🚀 Quick Start

### Prerequisites
- **Bun.js** >= 1.0.0 ([Install Bun](https://bun.sh/docs/installation))
- **Docker** & **Docker Compose** ([Install Docker](https://docs.docker.com/get-docker/))
- **Node.js** >= 18.0.0 (for compatibility)

### Project Structure

```
Katadev/
├── 📁 api/                 # NestJS backend
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   └── package.json
├── 📁 site/                # Next.js frontend  
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── 📁 configs/             # Configuration files
├── 📁 docs/                # Documentation
├── 📁 scripts/             # Utility scripts
├── 🚀 deploy-remote.sh     # Production deployment
├── 📝 autopush.sh          # Git automation
└── 🐳 docker-compose.yml   # Docker orchestration
```

### Development Workflow

#### 1. Feature Development
```bash
# Tạo feature branch
git checkout -b feature/new-feature

# Development...
# Code, test, commit

# Auto push với autopush.sh
./autopush.sh "feat: implement new feature"
```

#### 2. Merge to Main
```bash
# Auto merge với dynamic main branch detection
./autopush.sh --merge "feat: add new feature"

# Hoặc merge vào branch cụ thể
./autopush.sh --main-branch develop --merge
```

#### 3. Deployment
```bash
# Deploy to staging
./deploy-remote.sh STAGING_IP staging.domain.com

# Deploy to production  
./deploy-remote.sh PROD_IP domain.com
```

## 🚢 Deployment

### Deployment Options

#### 1. Interactive Mode (Khuyến nghị)
```bash
./deploy-remote.sh --interactive
```
Hướng dẫn từng bước qua CLI wizard.

#### 2. Simple Deployment (IP only)
```bash
./deploy-remote.sh --simple 116.118.48.143
```
- Không cần domain
- Truy cập qua IP:PORT
- HTTP only (no SSL)

#### 3. Full Deployment (Domain + SSL)
```bash
./deploy-remote.sh 116.118.48.143 kataoffical.online
```
- Auto SSL với Let's Encrypt
- Nginx reverse proxy
- Subdomains support

#### 4. Custom Services
```bash
./deploy-remote.sh \
  --install-api \
  --install-postgres \
  --install-redis \
  --install-minio \
  --nginxapi \
  116.118.48.143 domain.com
```

### Scripts & Automation

#### autopush.sh - Git Automation
Automated Git workflow với smart features:

```bash
# Basic usage
./autopush.sh                           # Auto commit + push
./autopush.sh "feat: new feature"       # Custom message

# Merge workflow  
./autopush.sh --merge                   # Merge to main
./autopush.sh --merge "release v2.0"    # Custom merge message
./autopush.sh --main-branch dev --merge # Target specific branch
```

**Features:**
- ✅ Dynamic main branch detection (main/master/develop/dev)
- ✅ Smart commit message generation
- ✅ Safe merge with conflict detection
- ✅ Branch cleanup options
- ✅ Git repository validation

#### deploy-remote.sh - Production Deployment
One-command production deployment:

```bash
# Interactive mode
./deploy-remote.sh -i

# Quick modes
./deploy-remote.sh --simple IP           # HTTP only
./deploy-remote.sh IP DOMAIN             # HTTPS + SSL

# Advanced options
./deploy-remote.sh \
  --user ubuntu \
  --key ~/.ssh/custom.pem \
  --install-api \
  --install-postgres \
  --nginxapi \
  IP DOMAIN
```

**Features:**
- ✅ Automated server preparation
- ✅ Docker & Docker Compose installation
- ✅ SSL certificates với Let's Encrypt
- ✅ Nginx reverse proxy setup
- ✅ Firewall configuration
- ✅ Health checks
- ✅ Service monitoring

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [🚀 DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) | Hướng dẫn deploy chi tiết |
| [⚡ QUICK-START.md](QUICK-START.md) | Hướng dẫn bắt đầu nhanh |
| [🏗️ DEVELOPMENT.md](docs/guides/DEVELOPMENT.md) | Hướng dẫn development |
| [🔧 API Documentation](docs/api/) | API reference và examples |
| [🐛 TROUBLESHOOTING.md](docs/troubleshooting/TROUBLESHOOTING.md) | Xử lý sự cố |

---

## 📖 Documentation

### 📚 Core Guides
- [**🚀 Quick Start Guide**](docs/guides/QUICK-START.md) - Get up and running in 5 minutes
- [**🏗️ Architecture Overview**](docs/guides/ARCHITECTURE.md) - System design and components
- [**🔧 Development Guide**](docs/guides/DEVELOPMENT.md) - Development workflow and best practices
- [**📦 Deployment Guide**](docs/guides/DEPLOYMENT-GUIDE.md) - Complete deployment instructions

### 📋 API References
- [**🏢 HRM API**](docs/api/HRM-API.md) - Employee and department management endpoints
- [**🔐 Authentication API**](docs/api/AUTH-API.md) - JWT authentication and authorization
- [**🔧 System API**](docs/api/SYSTEM-API.md) - Health checks and system information

### 🛠️ Advanced Topics
- [**🔒 Security Configuration**](docs/security/SECURITY.md) - Security best practices and hardening
- [**📊 Monitoring Setup**](docs/monitoring/MONITORING.md) - Grafana, Prometheus, and logging
- [**🐳 Docker Configuration**](docs/docker/DOCKER.md) - Container orchestration and customization
- [**🚀 CI/CD Pipeline**](docs/cicd/PIPELINE.md) - Automated testing and deployment

---

## 🎯 Live Demo

### 🌐 Production Instance
- **Main App**: [http://116.118.48.143:3000](http://116.118.48.143:3000)
- **API Endpoint**: [http://116.118.48.143:3001](http://116.118.48.143:3001)
- **Database Admin**: [http://116.118.48.143:5050](http://116.118.48.143:5050)
- **File Storage**: [http://116.118.48.143:9000](http://116.118.48.143:9000)

### 🔑 Demo Credentials
```
Admin User:
- Email: admin@katadev.com
- Password: Admin123!

Manager User:
- Email: manager@katadev.com
- Password: Manager123!

Employee User:
- Email: employee@katadev.com
- Password: Employee123!
```

## 🔧 Management Commands

### Kiểm tra trạng thái deployment

```bash
# Kiểm tra containers đang chạy
ssh -i ~/.ssh/id_rsa root@SERVER_IP 'cd /opt/katadev && docker compose ps'

# Xem logs
ssh -i ~/.ssh/id_rsa root@SERVER_IP 'cd /opt/katadev && docker compose logs'

# Kiểm tra resource usage
ssh -i ~/.ssh/id_rsa root@SERVER_IP 'docker stats --no-stream'
```

### Restart services

```bash
# Restart tất cả services
ssh -i ~/.ssh/id_rsa root@SERVER_IP 'cd /opt/katadev && docker compose restart'

# Restart service cụ thể
ssh -i ~/.ssh/id_rsa root@SERVER_IP 'cd /opt/katadev && docker compose restart api'
```

### Update deployment

```bash
# Re-deploy với code mới
./deploy-remote.sh --force-regen SERVER_IP DOMAIN

# Update chỉ API
ssh -i ~/.ssh/id_rsa root@SERVER_IP 'cd /opt/katadev && docker compose build api && docker compose up -d api'
```

## 🔐 Security

### Security Features
- 🔒 JWT authentication
- 🛡️ Rate limiting
- 🔐 Input validation
- 🌐 CORS protection
- 🔑 Environment variable encryption
- 🚫 SQL injection prevention

### Production Security
- ✅ SSL/TLS encryption
- ✅ Firewall configuration
- ✅ Secure password generation
- ✅ Container isolation
- ✅ Regular security updates

## 🤝 Contributing

### Development Setup
1. Fork repository
2. Create feature branch
3. Implement changes
4. Write tests
5. Submit pull request

### Commit Convention
```bash
feat: add new feature
fix: resolve bug
docs: update documentation  
style: formatting changes
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

## 📞 Support & Community

### Getting Help
- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/your-org/Katadev/issues)
- 💬 [Discussions](https://github.com/your-org/Katadev/discussions)
- 📧 Email: support@katadev.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NestJS team for the powerful backend framework  
- Docker team for containerization technology
- Open source community

---

<div align="center">

**Made with ❤️ by the Katadev Team**

[⬆ Back to top](#-katadev---advanced-full-stack-development-platform)

</div>
│   ├── scripts/              # Automation scripts
│   ├── configs/              # Server configurations
│   └── templates/            # Config templates
├── 📁 docs/                  # Documentation
│   ├── guides/               # User guides
│   ├── api/                  # API documentation
│   └── examples/             # Code examples
└── 📁 scripts/               # Development scripts
    ├── setup/                # Initial setup
    ├── deployment/           # Deployment helpers
    └── maintenance/          # Maintenance tasks
```

### Prerequisites
- **Bun.js** v1.0+ ([Install Bun](https://bun.sh))
- **Docker** & **Docker Compose** (for deployment)
- **Git** for version control
- **Linux/macOS** (Windows with WSL2)

### 1. 📥 Clone & Setup
```bash
# Clone the repository
git clone https://github.com/chikiet/Katadev.git
cd Katadev

# Install all dependencies (frontend + backend)
bun run install:all

# Generate environment files
cp .env.example .env
```

### 2. 🏃 Local Development
```bash
# Start both frontend and backend
bun run dev

# Or start individually
bun run dev:site    # Frontend: http://localhost:3000
bun run dev:api     # Backend: http://localhost:3001
```

**Development URLs:**
- 🌐 **Frontend**: http://localhost:3000
- 🔌 **API**: http://localhost:3001
- ❤️ **Health Check**: http://localhost:3001/health
- 🏢 **HRM System**: http://localhost:3000/hr

### 3. 🎯 HRM System Setup
```bash
# Seed database with test data
curl -X POST http://localhost:3001/api/seed/hrm

# Login with test credentials
# HR Manager: hr.manager@company.com / hr123456
# IT Manager: it.manager@company.com / it123456
# Sales Manager: sales.manager@company.com / sales123456
```

### 4. 🚀 Production Deployment

#### Option 1: Quick Deploy (Recommended)
```bash
# Deploy to any server with one command
./quick-deploy-enhanced.sh

# Follow interactive prompts for:
# - Server IP configuration
# - Domain and SSL setup
# - Service selection
# - Environment configuration
```

## 📖 Documentation

### 🏢 HRM System Features

#### 👥 Employee Management
- **Complete CRUD Operations** - Create, read, update, and delete employee records
- **Status Tracking** - Active, Inactive, Terminated, On Leave, Probation
- **Contract Types** - Full-time, Part-time, Contract, Internship, Freelance
- **Personal & Professional Info** - Contact details, emergency contacts, job history
- **Salary & Compensation** - Salary tracking with history and adjustments

#### 🏛️ Organizational Structure
- **Department Hierarchies** - Multi-level departments with parent-child relationships
- **Position Management** - Job roles with levels, responsibilities, and requirements
- **Manager Assignments** - Clear reporting structure and team management
- **Budget Tracking** - Department budgets and resource allocation

#### 🔑 Security & Permissions
- **Role-Based Access Control** - Granular permissions for different user types
- **JWT Authentication** - Secure token-based authentication with refresh tokens
- **Password Security** - bcrypt hashing with configurable salt rounds
- **Session Management** - Automatic token expiration and renewal

### 🚀 Deployment Options

#### 🎯 Development Mode
- **Local Environment** - SQLite database with hot reloading
- **Test Data** - Automated seeding with realistic employee data
- **Development Tools** - Prisma Studio, API testing, and debugging

#### 🌐 Production Deployment
- **Automated Setup** - One-command deployment with environment generation
- **SSL Certificates** - Automatic Let's Encrypt certificates with renewal
- **Docker Orchestration** - Multi-container setup with health monitoring
- **Security Hardening** - Production-ready configurations and secrets

#### 🔧 Infrastructure Services
- **PostgreSQL** - Primary database with backup and replication
- **Redis** - Caching and session storage
- **MinIO** - S3-compatible object storage for file uploads
- **pgAdmin** - Web-based database administration
- **Nginx** - Reverse proxy with SSL termination

---

## 📋 Available Scripts

### 🛠️ Development
```bash
bun run dev          # Start both frontend and backend
bun run dev:site     # Frontend only (Next.js)
bun run dev:api      # Backend only (NestJS)
bun run build        # Build for production
bun run test         # Run test suite
bun run lint         # Code quality checks
```

### 🚀 Deployment
```bash
# Interactive deployment
./quick-deploy-enhanced.sh          # Enhanced quick deploy
./deploy-wizard.sh                  # Step-by-step wizard
./deploy-production.sh              # Enterprise deployment

# Direct deployment
./deploy-remote-fixed.sh --simple SERVER_IP          # Simple mode
./deploy-remote-fixed.sh SERVER_IP DOMAIN            # Full mode with SSL
```

### 🗄️ Database Management
```bash
cd api && bun run prisma:generate   # Generate Prisma client
cd api && bun run prisma:migrate    # Run migrations
cd api && bun run prisma:studio     # Open database admin
cd api && bun run prisma:seed       # Seed with test data
```

### 🐳 Docker Operations
```bash
bun run docker:up      # Start local Docker stack
bun run docker:down    # Stop Docker services
bun run docker:logs    # View service logs
```

---

## 🎯 API Reference

### 🔐 Authentication
```bash
POST /api/auth/login     # User login with JWT tokens
POST /api/auth/logout    # Logout and token invalidation
POST /api/auth/refresh   # Token refresh for extended sessions
```

### 👥 Employee Management
```bash
GET    /api/hrm/employees        # List employees (paginated)
POST   /api/hrm/employees        # Create new employee
GET    /api/hrm/employees/:id    # Get employee details
PUT    /api/hrm/employees/:id    # Update employee
DELETE /api/hrm/employees/:id    # Delete employee
```

### 🏛️ Department Management
```bash
GET    /api/hrm/departments      # List all departments
POST   /api/hrm/departments      # Create department
PUT    /api/hrm/departments/:id  # Update department
DELETE /api/hrm/departments/:id  # Delete department
```

### 🔑 Role & Permissions
```bash
GET    /api/hrm/roles           # List roles with permissions
POST   /api/hrm/roles           # Create new role
PUT    /api/hrm/roles/:id       # Update role permissions
DELETE /api/hrm/roles/:id       # Delete role
```

### 📊 Data Seeding
```bash
POST /api/seed/hrm              # Seed database with test data
```

---

## 🔧 Configuration

### 🌍 Environment Variables
Katadev automatically generates secure environment variables during deployment:

```bash
# Application Configuration
NODE_ENV=production
API_VERSION=latest
SITE_VERSION=latest

# Database Configuration  
DATABASE_URL=postgresql://user:pass@postgres:5432/katadev
POSTGRES_DB=katadev
POSTGRES_USER=katadev
POSTGRES_PASSWORD=<auto-generated>

# Authentication & Security
JWT_SECRET=<auto-generated-64-char>
ENCRYPTION_KEY=<auto-generated-32-char>

# Redis Cache
REDIS_URL=redis://:password@redis:6379
REDIS_PASSWORD=<auto-generated>

# MinIO Object Storage
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=<auto-generated>
MINIO_ENDPOINT=minio
MINIO_PORT=9000

# Application URLs
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

### 🔐 Security Configuration
- **Automated Password Generation** - Cryptographically secure random passwords
- **SSL Certificate Management** - Automatic Let's Encrypt integration
- **CORS Configuration** - Proper cross-origin resource sharing setup
- **Security Headers** - Production-ready security headers and configurations

---

## 📊 Monitoring & Maintenance

### 🔍 Health Monitoring
```bash
# Check service status
docker compose ps

# View real-time logs
docker compose logs -f

# Monitor resource usage
docker stats

# Check API health
curl https://yourdomain.com/api/health
```

### 🔄 Updates & Maintenance
```bash
# Update application
git pull
./deploy-remote-fixed.sh SERVER_IP DOMAIN

# Force environment regeneration
./deploy-remote-fixed.sh --force-regen SERVER_IP DOMAIN

# Clean deployment (removes old data)
./deploy-remote-fixed.sh --cleanup SERVER_IP
```

### 💾 Backup & Recovery
```bash
# Database backup
docker compose exec postgres pg_dump -U katadev katadev > backup.sql

# Restore from backup
docker compose exec -T postgres psql -U katadev -d katadev < backup.sql

# Full system backup
tar -czf katadev-backup-$(date +%Y%m%d).tar.gz /opt/katadev/
```

---

## 🚨 Troubleshooting

### 🔧 Common Development Issues

#### Dependencies Installation
```bash
# Clear and reinstall dependencies
bun run clean
bun run install:all
```

#### Port Conflicts
```bash
# Check port usage
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Kill processes if needed
sudo kill -9 <PID>
```

#### Database Issues
```bash
# Reset Prisma client
cd api && bun run prisma:generate

# Reset database (development only)
cd api && bun run prisma:reset
```

### 🚀 Common Deployment Issues

#### SSH Connection Problems
```bash
# Test SSH connection
ssh -i ~/.ssh/default root@SERVER_IP

# Fix SSH permissions
chmod 600 ~/.ssh/default
chmod 644 ~/.ssh/default.pub
```

#### Service Startup Issues
```bash
# Check container logs
docker compose logs service_name

# Restart specific service
docker compose restart service_name

# Full restart
docker compose down && docker compose up -d
```

#### SSL Certificate Issues
```bash
# Check certificate status
openssl s_client -connect yourdomain.com:443

# Force certificate renewal
certbot renew --force-renewal
```

---

## 🌍 Cloud Provider Support

Katadev is tested and supported on:

- **✅ DigitalOcean** - Droplets and Kubernetes
- **✅ AWS** - EC2, ECS, and Lambda
- **✅ Google Cloud** - Compute Engine and Cloud Run
- **✅ Azure** - Virtual Machines and Container Instances
- **✅ Linode** - Compute Instances
- **✅ Vultr** - Cloud Compute
- **✅ Hetzner** - Cloud Servers

### 📋 Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Network**: 1Gbps
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 🔧 Development Setup
```bash
# Fork and clone
git clone https://github.com/yourusername/Katadev.git
cd Katadev

# Install dependencies
bun run install:all

# Create feature branch
git checkout -b feature/amazing-feature

# Start development
bun run dev
```

### 📝 Contribution Guidelines
- **Code Style**: Follow TypeScript best practices and ESLint rules
- **Testing**: Add tests for new features and API endpoints
- **Documentation**: Update documentation for new features
- **Commits**: Use conventional commit messages
- **Reviews**: All PRs require review and passing tests

### 🧪 Testing
```bash
# Run all tests
bun run test

# Run with coverage
cd api && bun run test:cov

# Test deployment
./test-deployment.sh

# Lint code
bun run lint
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Community

<div align="center">

### 🆘 Getting Help

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red.svg)](https://github.com/chikiet/Katadev/issues)
[![GitHub Discussions](https://img.shields.io/badge/GitHub-Discussions-blue.svg)](https://github.com/chikiet/Katadev/discussions)
[![Documentation](https://img.shields.io/badge/Docs-Available-green.svg)](https://docs.katadev.com)

**📧 Email**: support@katadev.com  
**💬 Community**: [Join our Discord](https://discord.gg/katadev)  
**📚 Documentation**: [docs.katadev.com](https://docs.katadev.com)

</div>

### 🎯 Quick Help Commands
```bash
./deploy-remote-fixed.sh --help     # Deployment help
./test-deployment.sh                # Validate configuration
bun run dev                         # Start development
curl http://localhost:3001/health   # Test API
```

---

<div align="center">

### 🚀 Ready to Deploy?

**Quick Start**: `./quick-deploy-enhanced.sh`

**Full Deploy**: `./deploy-production.sh SERVER_IP DOMAIN.COM`

---

**⭐ Star us on GitHub** • **🐛 Report Issues** • **💡 Request Features**

**Made with ❤️ by the Katadev Team**

*Deploy once, scale everywhere!*

</div>




Phong cách Website monochrome IU có darkmode,reponsive