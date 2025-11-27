# 🚀 Timonacore - Modern Fullstack Starter Kit

> A high-performance, enterprise-ready fullstack starter kit built with the latest technologies and **Bun.js** for blazing-fast development.

[![Bun](https://img.shields.io/badge/Bun-1.1.34+-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![Next.js](https://img.shields.io/badge/Next.js-15.0+-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![GitHub](https://img.shields.io/github/stars/KataChannel/katastarterkit?style=social)](https://github.com/KataChannel/katastarterkit)

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/KataChannel/katastarterkit.git my-project
cd my-project

# Install dependencies (requires Bun.js)
bun install && cd backend && bun install && cd ../frontend && bun install && cd ..

# Start infrastructure
docker-compose up -d postgres redis minio

# Run database migrations
cd backend && bunx prisma migrate dev --name init && bunx prisma db seed && cd ..

# Start development servers
bun run dev
```

**🌐 Open:** http://localhost:3000 (Frontend) | http://localhost:4000/graphql (Backend API)

## 🏗️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[TailwindCSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Apollo Client](https://www.apollographql.com/docs/react)** - GraphQL client with caching
- **[NextAuth.js](https://next-auth.js.org)** - Authentication for Next.js

### Backend
- **[NestJS](https://nestjs.com)** - Progressive Node.js framework
- **[GraphQL](https://graphql.org)** - Query language for APIs
- **[Prisma](https://prisma.io)** - Type-safe database ORM
- **[PostgreSQL](https://postgresql.org)** - Robust relational database

### Infrastructure
- **[Bun.js](https://bun.sh)** - Fast JavaScript runtime and package manager
- **[Redis](https://redis.io)** - In-memory caching and pub/sub
- **[Minio](https://min.io)** - S3-compatible object storage
- **[Docker](https://docker.com)** - Containerization platform

## 📁 Project Structure

```
katastarterkit/
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# Reusable components
│   │   └── lib/       # Utilities and configs
│   └── package.json
├── backend/           # NestJS API
│   ├── src/
│   │   ├── modules/   # Feature modules
│   │   ├── common/    # Shared utilities
│   │   └── prisma/    # Database schema
│   └── package.json
├── docker-compose.yml # Development services
└── README.md
```

## 🛠️ Development Commands

```bash
# Install dependencies
make install
# or: bun run setup

# Start development
make dev
# or: bun run dev

# Run tests
make test
# or: bun run test

# Build for production
make build
# or: bun run build

# Database operations
make db-migrate      # Run migrations
make db-seed         # Seed database
make db-studio       # Open Prisma Studio

# Docker operations
make docker-up       # Start services
make docker-down     # Stop services
```

## 🚀 Features

### ✅ Ready-to-use Features
- **Authentication** - JWT-based auth with NextAuth.js
- **Database** - PostgreSQL with Prisma ORM and migrations
- **GraphQL API** - Type-safe API with Apollo Server
- **File uploads** - S3-compatible storage with Minio
- **Caching** - Redis for session and data caching
- **Real-time** - GraphQL subscriptions ready
- **TypeScript** - Full type safety across the stack

### 🔧 Developer Experience  
- **Hot reload** - Instant development feedback
- **Code quality** - ESLint, Prettier, TypeScript
- **Testing** - Jest, React Testing Library, Cypress
- **Docker** - Containerized development environment
- **Documentation** - Comprehensive setup guides

### 🏢 Production Ready
- **Performance** - Optimized builds and caching
- **Security** - Authentication, validation, rate limiting
- **Monitoring** - Health checks and logging
- **Deployment** - Docker multi-stage builds
- **Scalability** - Microservice-ready architecture

## 📚 Prerequisites

- **[Bun.js](https://bun.sh)** 1.1.34+ (primary runtime)
- **[Docker](https://docker.com)** & Docker Compose (for services)
- **[Git](https://git-scm.com)** (for version control)

## 🔧 Environment Setup

1. **Copy environment files:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

2. **Update database configuration in `backend/.env`:**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/timonacore"
   REDIS_URL="redis://localhost:6379"
   ```

3. **Start infrastructure services:**
   ```bash
   docker-compose up -d postgres redis minio
   ```

## 📖 Documentation

- [Backend Setup](./docs/backend-setup.md) - NestJS + GraphQL + Prisma
- [Frontend Setup](./docs/frontend-setup.md) - Next.js + TailwindCSS + Apollo
- [Bun Integration](./docs/bun-integration.md) - Using Bun.js effectively

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by best practices from the developer community
- Optimized for developer experience and production performance

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/KataChannel/katastarterkit/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/KataChannel/katastarterkit/issues)
- 💬 **Questions**: [GitHub Discussions](https://github.com/KataChannel/katastarterkit/discussions)

---

**Happy coding! 🎉**

> **Timonacore** - Build faster, ship smarter.

⭐ **If you find this project helpful, please give it a star on GitHub!**
