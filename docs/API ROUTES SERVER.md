# Cấu trúc thư mục tối ưu cho dự án Next.js Full-stack

```
my-nextjs-app/
├── 📁 .next/                          # Build output (auto-generated)
├── 📁 .vscode/                        # VS Code settings
│   ├── settings.json
│   └── extensions.json
├── 📁 public/                         # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   ├── images/
│   └── icons/
├── 📁 src/                           # Source code chính
│   ├── 📁 app/                       # App Router (Next.js 13+)
│   │   ├── 📁 (auth)/               # Route groups
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── 📁 (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── 📁 api/                  # API routes
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   └── register/
│   │   │   │       └── route.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── products/
│   │   │       ├── route.ts
│   │   │       └── [slug]/
│   │   │           └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   ├── loading.tsx             # Global loading UI
│   │   ├── error.tsx               # Global error UI
│   │   └── not-found.tsx           # 404 page
│   ├── 📁 components/               # React components
│   │   ├── 📁 ui/                  # Base UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── index.ts
│   │   ├── 📁 forms/               # Form components
│   │   │   ├── LoginForm/
│   │   │   ├── UserForm/
│   │   │   └── index.ts
│   │   ├── 📁 layout/              # Layout components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── index.ts
│   │   └── 📁 features/            # Feature-specific components
│   │       ├── Auth/
│   │       ├── Dashboard/
│   │       └── Products/
│   ├── 📁 lib/                     # Utility libraries
│   │   ├── 📁 auth/               # Authentication logic
│   │   │   ├── config.ts
│   │   │   ├── providers.ts
│   │   │   └── middleware.ts
│   │   ├── 📁 database/           # Database configuration
│   │   │   ├── connection.ts
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── 📁 validators/         # Validation schemas
│   │   │   ├── user.ts
│   │   │   ├── auth.ts
│   │   │   └── product.ts
│   │   ├── 📁 utils/              # Helper functions
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   ├── formatters.ts
│   │   │   └── api.ts
│   │   └── 📁 services/           # External services
│   │       ├── email.ts
│   │       ├── payment.ts
│   │       └── storage.ts
│   ├── 📁 hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useApi.ts
│   │   └── index.ts
│   ├── 📁 store/                   # State management
│   │   ├── 📁 slices/             # Redux slices hoặc Zustand stores
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   └── productSlice.ts
│   │   ├── index.ts
│   │   └── providers.tsx
│   ├── 📁 styles/                  # Styling files
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── tailwind.css
│   ├── 📁 types/                   # TypeScript type definitions
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── product.ts
│   │   └── index.ts
│   └── 📁 middleware.ts            # Next.js middleware
├── 📁 tests/                       # Test files
│   ├── 📁 __mocks__/
│   ├── 📁 components/
│   ├── 📁 pages/
│   ├── 📁 api/
│   ├── setup.ts
│   └── utils.ts
├── 📁 docs/                        # Documentation
│   ├── README.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── 📁 scripts/                     # Build/deployment scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── seed-db.ts
├── 📁 .github/                     # GitHub workflows
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── .env.local                      # Environment variables (local)
├── .env.example                    # Environment variables template
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Giải thích chi tiết các thư mục chính:

### 📁 `src/app/` - App Router
- **Route Groups**: Sử dụng `(auth)`, `(dashboard)` để tổ chức routes không ảnh hưởng URL
- **API Routes**: Tất cả API endpoints trong `src/app/api/`
- **Special Files**: `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`

### 📁 `src/components/` - Component Architecture
- **`ui/`**: Base components tái sử dụng (Button, Input, Modal)
- **`forms/`**: Form components phức tạp
- **`layout/`**: Layout components (Header, Footer, Sidebar)
- **`features/`**: Feature-specific components theo domain

### 📁 `src/lib/` - Core Libraries
- **`auth/`**: Authentication logic và middleware
- **`database/`**: Database configuration, migrations, seeds
- **`validators/`**: Validation schemas (Zod, Yup)
- **`utils/`**: Helper functions và utilities
- **`services/`**: External service integrations

### 📁 `src/hooks/` - Custom Hooks
- Custom React hooks cho logic tái sử dụng
- Authentication hooks, API hooks, utility hooks

### 📁 `src/store/` - State Management
- Redux Toolkit slices hoặc Zustand stores
- Global state management và providers

### 📁 `src/types/` - TypeScript Types
- Centralized type definitions
- API types, domain types, utility types

## Best Practices được áp dụng:

### 1. **Separation of Concerns**
- Frontend components tách biệt với API logic
- Business logic trong `lib/` và `services/`
- UI components thuần túy trong `components/ui/`

### 2. **Scalability**
- Feature-based organization
- Modular architecture
- Easy to add new features

### 3. **Developer Experience**
- Consistent naming conventions
- Clear folder structure
- Comprehensive testing setup

### 4. **Performance Optimization**
- Lazy loading components
- Optimized imports với barrel exports
- Static asset optimization

### 5. **Type Safety**
- Comprehensive TypeScript types
- API contract types
- Runtime validation

## Naming Conventions:

- **Files**: PascalCase cho components, camelCase cho utilities
- **Folders**: camelCase cho utilities, PascalCase cho components
- **API Routes**: RESTful naming
- **Components**: PascalCase với descriptive names

## Configuration Files:

- **`next.config.js`**: Next.js configuration
- **`tailwind.config.js`**: Styling configuration
- **`tsconfig.json`**: TypeScript configuration
- **`.eslintrc.json`**: Code linting rules
- **`.prettierrc`**: Code formatting rules

Cấu trúc này đảm bảo dự án dễ maintain, scale và phát triển với team lớn.