import { PrismaClient, UserRole, PostStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@timonacore.dev' },
    update: {},
    create: {
      email: 'admin@timonacore.dev',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  // Create test users
  const userPassword = await bcrypt.hash('user123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@timonacore.dev' },
    update: {},
    create: {
      email: 'user@timonacore.dev',
      username: 'testuser',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
    },
  });

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: {
        name: 'Next.js',
        slug: 'nextjs',
        description: 'The React Framework for Production',
        color: '#000000',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'nestjs' },
      update: {},
      create: {
        name: 'NestJS',
        slug: 'nestjs',
        description: 'A progressive Node.js framework',
        color: '#ea2845',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'graphql' },
      update: {},
      create: {
        name: 'GraphQL',
        slug: 'graphql',
        description: 'A query language for APIs',
        color: '#e10098',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: {
        name: 'Prisma',
        slug: 'prisma',
        description: 'Next-generation ORM',
        color: '#2d3748',
      },
    }),
  ]);

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Welcome to Timonacore',
        content: `# Welcome to Timonacore

Timonacore is an enterprise-grade fullstack starter kit built with modern technologies.

## Features

- **Next.js 14** with TypeScript
- **NestJS** with GraphQL
- **Prisma ORM** with PostgreSQL
- **Redis** for caching
- **Minio** for object storage
- **Docker** for containerization

This starter kit provides everything you need to build scalable, production-ready applications.`,
        excerpt: 'Learn about Timonacore, the enterprise fullstack starter kit.',
        slug: 'welcome-to-timonacore',
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: admin.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Getting Started with GraphQL',
        content: `# Getting Started with GraphQL

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.

## Why GraphQL?

1. **Single Endpoint**: All your data needs through one URL
2. **Type Safety**: Strong type system
3. **Efficient**: Request exactly what you need
4. **Real-time**: Built-in subscription support

## Basic Query Example

\`\`\`graphql
query GetPosts {
  posts {
    id
    title
    author {
      username
    }
  }
}
\`\`\`

This query will fetch posts with their titles and author usernames.`,
        excerpt: 'Learn the basics of GraphQL and how to use it effectively.',
        slug: 'getting-started-with-graphql',
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: testUser.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Building Scalable Applications with NestJS',
        content: `# Building Scalable Applications with NestJS

NestJS is a framework for building efficient, reliable and scalable server-side applications.

## Key Features

- **Modular Architecture**: Organize your code with modules
- **Dependency Injection**: Built-in IoC container
- **GraphQL Support**: First-class GraphQL support
- **Testing**: Comprehensive testing utilities

## Example Module

\`\`\`typescript
@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
\`\`\``,
        excerpt: 'Discover how to build scalable applications using NestJS framework.',
        slug: 'building-scalable-applications-with-nestjs',
        status: PostStatus.DRAFT,
        authorId: admin.id,
      },
    }),
  ]);

  // Add tags to posts
  await Promise.all([
    prisma.postTag.create({
      data: {
        postId: posts[0].id,
        tagId: tags[0].id, // Next.js
      },
    }),
    prisma.postTag.create({
      data: {
        postId: posts[0].id,
        tagId: tags[1].id, // NestJS
      },
    }),
    prisma.postTag.create({
      data: {
        postId: posts[1].id,
        tagId: tags[2].id, // GraphQL
      },
    }),
    prisma.postTag.create({
      data: {
        postId: posts[2].id,
        tagId: tags[1].id, // NestJS
      },
    }),
  ]);

  // Create sample comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great introduction to Timonacore! Looking forward to using it.',
        postId: posts[0].id,
        userId: testUser.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Very helpful GraphQL tutorial. Thanks for sharing!',
        postId: posts[1].id,
        userId: admin.id,
      },
    }),
  ]);

  // Create sample likes
  await Promise.all([
    prisma.like.create({
      data: {
        postId: posts[0].id,
        userId: testUser.id,
      },
    }),
    prisma.like.create({
      data: {
        postId: posts[1].id,
        userId: admin.id,
      },
    }),
  ]);

  console.log('✅ Seed completed successfully!');
  console.log(`👤 Admin user: admin@timonacore.dev / admin123`);
  console.log(`👤 Test user: user@timonacore.dev / user123`);
  console.log(`📝 Created ${posts.length} posts`);
  console.log(`🏷️ Created ${tags.length} tags`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
