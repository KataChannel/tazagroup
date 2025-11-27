# Frontend Setup Guide

This guide covers the setup and configuration of the Timonacore Next.js frontend with TailwindCSS.

## Prerequisites

- Node.js 18 or higher OR Bun 1.0+
- Backend API running on port 4000

## Installation

1. **Install dependencies**

**With Node.js:**
```bash
cd frontend
npm install
```

**With Bun.js (Faster):**
```bash
cd frontend
bun install
```

2. **Environment Configuration**
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## Development

### Starting the Development Server

**With Node.js:**
```bash
npm run dev
```

**With Bun.js (Faster startup & HMR):**
```bash
bun run dev:bun
```

The application will be available at `http://localhost:3000`

### Building for Production

**With Node.js:**
```bash
npm run build
npm start
```

**With Bun.js:**
```bash
bun run build:bun
bun run start:bun
```

### Performance Benefits with Bun.js

**Development Experience:**
- 🚀 **Faster installation**: Package installation is 3-4x faster
- ⚡ **Faster builds**: Next.js builds complete 2x faster
- 🔥 **Better HMR**: Hot module replacement is near-instant
- 💾 **Lower memory usage**: Development server uses ~25% less memory
- 📦 **Native TypeScript**: No transpilation step needed

**Benchmarks (typical Next.js app):**
```
Operation          | Node.js | Bun.js | Improvement
-------------------|---------|---------|------------
Package install    | 45s     | 12s     | 3.75x
Dev server start   | 8s      | 3s      | 2.67x
Hot reload         | 800ms   | 150ms   | 5.33x
Production build   | 120s    | 60s     | 2x
```

## Architecture

### App Router Structure
```
src/app/
├── globals.css          # Global styles with TailwindCSS
├── layout.tsx          # Root layout
├── page.tsx           # Homepage
├── (auth)/            # Authentication pages
│   ├── login/
│   └── register/
├── dashboard/         # Protected dashboard
├── posts/            # Blog posts
└── api/              # API routes
```

### Component Library

All components are built with TailwindCSS and follow atomic design principles:

**Atoms** (Basic building blocks):
```typescript
// Button component
<Button variant="primary" size="md">
  Click me
</Button>

// Input component  
<Input 
  type="email" 
  placeholder="Enter email"
  error="Email is required"
/>
```

**Molecules** (Component combinations):
```typescript
// Form Field
<FormField
  label="Email Address"
  input={<Input type="email" />}
  error={errors.email}
/>

// Search Bar
<SearchBar
  onSearch={handleSearch}
  placeholder="Search posts..."
/>
```

**Organisms** (Complex components):
```typescript
// Header Navigation
<Header />

// Post List
<PostList posts={posts} />

// Comment Section
<CommentSection postId={postId} />
```

**Templates** (Page layouts):
```typescript
// Dashboard Layout
<DashboardLayout>
  <Sidebar />
  <MainContent />
</DashboardLayout>
```

### TailwindCSS Usage

**Design System Classes:**
```css
/* Custom button variants */
.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 
         focus:ring-primary-500 px-4 py-2 rounded-md 
         transition-colors;
}

/* Card components */
.card {
  @apply bg-white shadow rounded-lg border border-gray-200;
}

/* Input styles */
.input {
  @apply block w-full rounded-md border-gray-300 
         shadow-sm focus:border-primary-500 
         focus:ring-primary-500;
}
```

**Responsive Design:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>

<div className="hidden sm:block lg:hidden">
  {/* Show only on tablet */}
</div>
```

**Dark Mode Support:**
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Auto dark mode */}
</div>
```

### State Management

Using Zustand for client-side state:

```typescript
// Store definition
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  setUser: (user: User) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const useAppStore = create<AppState>((set) => ({
  user: null,
  theme: 'light',
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
}));

// Usage in components
const { user, setUser } = useAppStore();
```

### GraphQL Integration

Using Apollo Client for GraphQL operations:

**Queries:**
```typescript
const GET_POSTS = gql`
  query GetPosts($limit: Int, $offset: Int) {
    posts(limit: $limit, offset: $offset) {
      id
      title
      excerpt
      publishedAt
      author {
        username
        avatar
      }
    }
  }
`;

const { data, loading, error } = useQuery(GET_POSTS, {
  variables: { limit: 10, offset: 0 },
});
```

**Mutations:**
```typescript
const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      slug
    }
  }
`;

const [createPost, { loading }] = useMutation(CREATE_POST, {
  onCompleted: (data) => {
    router.push(`/posts/${data.createPost.slug}`);
  },
});
```

**Subscriptions:**
```typescript
const NEW_COMMENT = gql`
  subscription NewComment($postId: String!) {
    newComment(postId: $postId) {
      id
      content
      createdAt
      user {
        username
        avatar
      }
    }
  }
`;

const { data } = useSubscription(NEW_COMMENT, {
  variables: { postId },
});
```

### Authentication

Using NextAuth.js for authentication:

```typescript
// Configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Authenticate with backend API
        const user = await authenticateUser(credentials);
        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
};

// Usage in components
const { data: session, status } = useSession();

if (status === "loading") return <LoadingSpinner />;
if (status === "unauthenticated") return <LoginForm />;

return <Dashboard user={session.user} />;
```

### Form Handling

Using React Hook Form with Yup validation:

```typescript
const schema = yup.object({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  tags: yup.array().of(yup.string()).min(1, 'At least one tag required'),
});

const CreatePostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await createPost({ variables: { input: data } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('title')}
          placeholder="Post title"
          error={errors.title?.message}
        />
      </div>
      <div>
        <Textarea
          {...register('content')}
          placeholder="Post content"
          error={errors.content?.message}
        />
      </div>
      <Button type="submit" loading={isSubmitting}>
        Create Post
      </Button>
    </form>
  );
};
```

## Styling Guidelines

### TailwindCSS Best Practices

1. **Use semantic class names:**
```tsx
// Good
<button className="btn-primary">Submit</button>

// Avoid
<button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
```

2. **Responsive-first approach:**
```tsx
// Mobile first, then larger screens
<div className="w-full md:w-1/2 lg:w-1/3">
```

3. **Use CSS variables for dynamic values:**
```css
:root {
  --primary-color: #3b82f6;
}

.btn-primary {
  background-color: var(--primary-color);
}
```

4. **Component variants:**
```tsx
const Button = ({ variant, size, children, ...props }) => {
  const baseClasses = 'font-medium rounded transition-colors';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Component Organization

```
src/components/
├── ui/              # Reusable UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── modal.tsx
│   └── index.ts
├── forms/           # Form components
│   ├── login-form.tsx
│   ├── post-form.tsx
│   └── index.ts
├── layout/          # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   └── index.ts
├── sections/        # Page sections
│   ├── hero.tsx
│   ├── features.tsx
│   └── index.ts
└── providers/       # Context providers
    ├── apollo-provider.tsx
    ├── theme-provider.tsx
    └── index.ts
```

## Testing

### Unit Testing with Jest
```bash
npm run test
```

### E2E Testing with Cypress
```bash
npm run test:e2e
```

Example test:
```typescript
describe('Authentication', () => {
  it('should login user successfully', () => {
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type('user@example.com');
    cy.get('[data-testid=password-input]').type('password');
    cy.get('[data-testid=login-button]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## Performance Optimization

### Next.js Features

1. **Image Optimization:**
```tsx
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority
  placeholder="blur"
/>
```

2. **Dynamic Imports:**
```tsx
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

3. **API Route Caching:**
```typescript
export async function GET() {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

### Bundle Analysis
```bash
npm run analyze
```

### Lighthouse Optimization

- **Core Web Vitals**: Ensure good scores
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Proper meta tags and structured data
- **Performance**: < 3s loading time

## Deployment

### Static Export
```bash
npm run build
npm run export
```

### Docker
```bash
docker build -t timonacore-frontend .
docker run -p 3000:3000 timonacore-frontend
```

### Vercel
```bash
vercel deploy
```

## Troubleshooting

### Common Issues

**Hydration Mismatch**
```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```
Solution: Ensure server and client render the same content.

**TailwindCSS Not Working**
Solution: Check PostCSS configuration and ensure TailwindCSS is imported.

**GraphQL Errors**
Solution: Check network tab and ensure backend API is running.

### Debug Tips

1. Use React Developer Tools
2. Enable Next.js debug mode: `DEBUG=* npm run dev`
3. Check browser console for errors
4. Use Apollo Client DevTools for GraphQL debugging
