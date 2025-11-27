# Backend Setup Guide

This guide covers the setup and configuration of the Timonacore NestJS backend.

## Prerequisites

- Node.js 18 or higher OR Bun 1.0+
- PostgreSQL 15+
- Redis 7+
- Minio (or S3-compatible storage)

## Installation

1. **Install dependencies**

**With Node.js:**
```bash
cd backend
npm install
```

**With Bun.js (Faster):**
```bash
cd backend
bun install
```

2. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/timonacore"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Minio
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
```

3. **Database Setup**

**With Node.js:**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

**With Bun.js:**
```bash
# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# Seed database
bunx prisma db seed
```

## Development

### Starting the Server

**With Node.js:**
```bash
npm run start:dev
```

**With Bun.js (Faster startup & hot reload):**
```bash
bun run start:dev
```

The server will start at `http://localhost:4000`
GraphQL Playground available at `http://localhost:4000/graphql`

### Performance Comparison

**Bun.js Benefits:**
- 🚀 **Faster installation**: 3-4x faster than npm
- ⚡ **Faster startup**: 2-3x faster server startup
- 🔥 **Better hot reload**: Near-instant file change detection
- 💾 **Lower memory usage**: ~30% less memory consumption
- 📦 **Built-in bundler**: No need for separate build tools

### Database Operations

**Create Migration**
```bash
npx prisma migrate dev --name <migration-name>
```

**Reset Database**
```bash
npx prisma migrate reset
```

**View Database**
```bash
npx prisma studio
```

## Architecture

### Modules

- **AuthModule**: JWT authentication and authorization
- **UsersModule**: User management
- **PostsModule**: Blog posts and content
- **CommentsModule**: Comment system
- **TagsModule**: Tag management
- **FilesModule**: File upload with Minio
- **HealthModule**: Health checks

### GraphQL Schema

The GraphQL schema is automatically generated from TypeScript code using code-first approach.

**Main Types:**
- `User`: User entity with roles and permissions
- `Post`: Blog post with content and metadata
- `Comment`: Comment with nested replies
- `Tag`: Content tags
- `FileUpload`: File upload metadata

**Key Queries:**
```graphql
query GetPosts($limit: Int, $offset: Int) {
  posts(limit: $limit, offset: $offset) {
    id
    title
    content
    author {
      username
    }
  }
}
```

**Key Mutations:**
```graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    slug
  }
}
```

**Subscriptions:**
```graphql
subscription NewComment($postId: String!) {
  newComment(postId: $postId) {
    id
    content
    user {
      username
    }
  }
}
```

### Caching Strategy

- **Redis TTL**: 60 seconds for queries
- **Cache Keys**: Structured as `module:operation:id`
- **Invalidation**: Automatic on mutations
- **Pub/Sub**: Real-time subscriptions

### Security Features

- **Rate Limiting**: 100 requests/minute per IP
- **Query Depth Limiting**: Maximum depth of 5
- **Query Complexity**: Maximum complexity of 1000
- **CORS**: Configured for frontend domain
- **JWT Validation**: All protected routes

### File Upload

Files are uploaded to Minio with the following flow:
1. Client uploads file to `/upload` endpoint
2. File is stored in Minio bucket
3. Metadata saved to database
4. Public URL returned

**Supported formats:**
- Images: jpg, jpeg, png, gif, webp
- Documents: pdf, doc, docx
- Archives: zip, tar.gz

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:e2e
```

### Coverage Report
```bash
npm run test:cov
```

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_HOST=redis-cluster-host
JWT_SECRET=secure-random-string-min-32-chars
MINIO_ENDPOINT=s3.amazonaws.com
MINIO_USE_SSL=true
```

### Docker Deployment
```bash
docker build -t timonacore-backend .
docker run -p 4000:4000 timonacore-backend
```

### Health Checks
The application provides health check endpoints:
- `/health`: Basic health check
- `/health/detailed`: Detailed health status

## Monitoring

### Logging
- **Winston**: Structured logging
- **Log Levels**: error, warn, info, debug
- **Format**: JSON in production

### Metrics
Prometheus metrics available at `/metrics`:
- HTTP request duration
- GraphQL operation count
- Database connection pool
- Redis cache hit/miss ratio

## Troubleshooting

### Common Issues

**Database Connection Error**
```
Error: P1001: Can't reach database server
```
Solution: Check if PostgreSQL is running and credentials are correct.

**Redis Connection Error**
```
Error: ECONNREFUSED ::1:6379
```
Solution: Ensure Redis is running on the specified host and port.

**Minio Connection Error**
```
Error: MinioError: Invalid endpoint
```
Solution: Verify Minio endpoint and credentials.

### Debug Mode
```bash
NODE_ENV=development npm run start:debug
```

### Performance Optimization

1. **Database Queries**: Use proper indexes
2. **Redis Caching**: Cache expensive operations
3. **GraphQL**: Use DataLoader for N+1 queries
4. **File Uploads**: Use streaming for large files

## API Documentation

GraphQL Playground provides interactive documentation at:
`http://localhost:4000/graphql`

For REST endpoints, see the auto-generated Swagger docs at:
`http://localhost:4000/api/docs`
