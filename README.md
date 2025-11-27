# 🚀 TazaGroup - Modern Fullstack E-Learning Platform

![TazaGroup](https://img.shields.io/badge/TazaGroup-E--Learning%20Platform-blue)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.1.6-red)](https://nestjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.1.12-38B2AC)](https://tailwindcss.com/)

A modern, production-ready e-learning platform built with the latest technologies. Designed for educators, instructors, and students with comprehensive course management, interactive learning features, and AI-powered support.

## 📚 Documentation

**Complete documentation is available in the [`docs/`](docs/) folder**:

- 📖 [Getting Started](docs/01-GETTING-STARTED.md) - 5-minute setup guide
- 🏗️ [Architecture](docs/02-ARCHITECTURE.md) - System design and tech stack
- ✨ [Features](docs/03-FEATURES.md) - 100+ features overview
- 💻 [Development](docs/04-DEVELOPMENT.md) - Workflow and best practices
- 🚀 [Deployment](docs/05-DEPLOYMENT.md) - Production deployment guide
- 📡 [API Reference](docs/06-API-REFERENCE.md) - GraphQL API documentation
- 🐛 [Troubleshooting](docs/07-TROUBLESHOOTING.md) - Common issues and solutions

👉 **Start here**: [docs/README.md](docs/README.md)

## 🌟 Key Features

### 📚 Course Management
- ✅ Create and manage courses with rich content
- ✅ Video lessons with progress tracking
- ✅ Quizzes and assessments
- ✅ Certificate generation
- ✅ Course enrollment and payment integration

### 👨‍🏫 Instructor Tools
- ✅ Instructor dashboard with analytics
- ✅ Student progress monitoring
- ✅ Content management system
- ✅ Live sessions and webinars
- ✅ Revenue tracking

### 🎓 Student Experience
- ✅ Personalized learning dashboard
- ✅ Course progress tracking
- ✅ Interactive quizzes and assignments
- ✅ Certificate downloads
- ✅ AI-powered support chat

### 🤖 AI Integration
- ✅ AI-powered support chat with Google Gemini
- ✅ Automated course recommendations
- ✅ Smart content suggestions
- ✅ Intelligent Q&A system

### 💬 Communication
- ✅ In-platform messaging
- ✅ Discussion forums
- ✅ Live chat support
- ✅ Email notifications

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ or Bun 1.1+
- PostgreSQL 16+
- Redis 7+
- MinIO (for file storage)
- Docker & Docker Compose (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/KataChannel/tazagroup.git
   cd tazagroup
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start database services**
   ```bash
   docker-compose up -d postgres redis minio
   ```

5. **Run database migrations**
   ```bash
   cd backend
   bun run prisma:migrate:dev
   ```

6. **Start development servers**
   ```bash
   # Option 1: Use interactive menu
   ./vscode-menu.sh
   
   # Option 2: Run directly
   bun run dev  # Starts both backend and frontend
   ```

## 🌐 Access URLs

- **Frontend**: http://116.118.49.243:13000
- **Backend API**: http://116.118.49.243:13001
- **GraphQL Playground**: http://116.118.49.243:13001/graphql
- **MinIO Console**: http://116.118.49.243:12008
- **PgAdmin**: http://116.118.49.243:13002

## 🏗️ Architecture

### 🎯 **Frontend (Next.js 15 + React 19)**

- ⚡ **Next.js 15** with App Router
- ⚛️ **React 19** with latest features
- 🎨 **TailwindCSS v4** with modern styling
- 📱 **Responsive Design** with mobile-first approach
- 🔒 **NextAuth.js** authentication
- 📊 **Apollo Client** for GraphQL
- 🧪 **Testing** with Jest + Cypress

### 🏗️ **Backend (NestJS + GraphQL)**

- 🚀 **NestJS 11** with modern architecture
- 🔗 **GraphQL API** with Apollo Server
- 🗄️ **Prisma ORM** with PostgreSQL
- 🔐 **JWT Authentication** & authorization
- ⚡ **Redis** for caching and sessions
- 📦 **File Upload** with MinIO
- 🛡️ **Security** best practices
- 📈 **Health Checks** and monitoring

### 🛠️ **Developer Experience**

- 🏃‍♂️ **Bun.js** for ultra-fast package management
- 🐳 **Docker** containerization
- 📘 **TypeScript** throughout the stack
- 📝 **ESLint** and **Prettier** configured
- 🧪 **Testing** setup for both frontend and backend
- 📚 **Comprehensive documentation**

## 📁 Project Structure

```
tazagroup/
├── backend/              # NestJS Backend
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── courses/     # Course management
│   │   ├── users/       # User management
│   │   ├── payments/    # Payment integration
│   │   └── ...
│   ├── prisma/          # Database schema
│   └── package.json
│
├── frontend/            # Next.js Frontend
│   ├── src/
│   │   ├── app/         # Next.js App Router
│   │   ├── components/  # React components
│   │   ├── lib/         # Utilities
│   │   └── ...
│   └── package.json
│
├── docker/              # Docker configs
├── docs/                # Documentation
├── scripts/             # Utility scripts
├── docker-compose.yml   # Docker setup
├── .env                 # Environment variables
└── README.md
```

## 🛠️ Available Scripts

### Development

```bash
# Start both backend and frontend
bun run dev

# Start backend only
bun run dev:backend

# Start frontend only
bun run dev:frontend

# Open Prisma Studio (Database GUI)
bun run db:studio
```

### Database

```bash
# Run migrations
bun run db:migrate

# Push schema changes
bun run db:push

# Seed database
bun run db:seed
```

### Docker

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose build
```

### Utilities

```bash
# Interactive development menu
./vscode-menu.sh

# Interactive advanced menu
./dev-menu.sh

# Script selector
./menu.sh
```

## 🚀 Deployment

### Production Deployment

1. **Update environment variables**
   ```bash
   # Edit .env for production settings
   nano .env
   ```

2. **Build and deploy with Docker**
   ```bash
   docker-compose up -d --build
   ```

3. **Run database migrations**
   ```bash
   docker-compose exec backend bun run prisma:migrate:deploy
   ```

For detailed deployment instructions, see [docs/05-DEPLOYMENT.md](docs/05-DEPLOYMENT.md)

## 🔒 Environment Variables

Key environment variables (see `.env` for full configuration):

```bash
# Application
NODE_ENV=development
PORT=13001
FRONTEND_URL=http://116.118.49.243:13000

# Database
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/tazagroupcore"

# Redis
REDIS_HOST=116.118.49.243
REDIS_PORT=12004
REDIS_PASSWORD=123456

# MinIO Storage
MINIO_ENDPOINT=storage.tazagroup.vn
MINIO_ACCESS_KEY=minio-admin
MINIO_SECRET_KEY=minio-secret-2025
MINIO_BUCKET_NAME=tazagroup-uploads

# AI Support
GOOGLE_GEMINI_API_KEY=your-api-key-here

# Authentication
JWT_SECRET=your-jwt-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here
```

## 🧪 Testing

```bash
# Run all tests
bun test

# Run backend tests
cd backend && bun test

# Run frontend tests
cd frontend && bun test

# Run E2E tests
bun test:e2e
```

## 📊 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 15, React 19, TailwindCSS v4 |
| **Backend** | NestJS 11, GraphQL, Apollo Server |
| **Database** | PostgreSQL 16, Prisma ORM |
| **Cache** | Redis 7 |
| **Storage** | MinIO (S3-compatible) |
| **Auth** | NextAuth.js, JWT |
| **AI** | Google Gemini API |
| **Runtime** | Bun.js, Node.js 20+ |
| **DevOps** | Docker, Docker Compose |
| **Testing** | Jest, Cypress |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by best practices in e-learning platforms
- Community-driven development

## 📞 Support

- 📧 Email: support@tazagroup.vn
- 🌐 Website: https://tazagroup.vn
- 📚 Documentation: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/KataChannel/tazagroup/issues)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Video streaming optimization
- [ ] Offline course downloads
- [ ] Gamification features
- [ ] Social learning features

---

**Made with ❤️ by TazaGroup Team**
