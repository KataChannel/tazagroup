# Fix: GraphQL Non-Nullable Field Error

## ❌ Lỗi
```
Cannot return null for non-nullable field BlogAuthorType.firstName
```

## 🔍 Nguyên nhân
- **GraphQL Schema**: `BlogAuthorType.firstName` và `lastName` được định nghĩa là **non-nullable** (`@Field()`)
- **Database**: User model có `firstName` và `lastName` là **nullable** (`String?`)
- **Dữ liệu**: Một số user trong DB có `firstName` hoặc `lastName` = null
- **Kết quả**: GraphQL không thể trả về null cho field bắt buộc → lỗi runtime

## ✅ Giải pháp

### File: `/backend/src/graphql/types/blog.type.ts`

**Trước khi fix:**
```typescript
@ObjectType()
export class BlogAuthorType {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()              // ❌ Non-nullable
  firstName: string;

  @Field()              // ❌ Non-nullable
  lastName: string;

  @Field()
  email: string;
}
```

**Sau khi fix:**
```typescript
@ObjectType()
export class BlogAuthorType {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field({ nullable: true })  // ✅ Nullable
  firstName?: string;

  @Field({ nullable: true })  // ✅ Nullable
  lastName?: string;

  @Field()
  email: string;
}
```

## 🔄 Tác động

- Frontend GraphQL query có thể nhận `firstName: null` hoặc `lastName: null`
- Không còn lỗi runtime khi query blogs có author không có tên
- Tương thích với Prisma schema: `firstName String?`, `lastName String?`

## 🧪 Kiểm tra

**Query:**
```graphql
query GetBlogs {
  blogs(page: 1, limit: 20, statusFilter: "ALL") {
    data {
      id
      title
      author {
        id
        username
        firstName  # Có thể null
        lastName   # Có thể null
        email
      }
    }
  }
}
```

**Kết quả mong đợi:**
- Không còn lỗi GraphQL execution
- Author có thể có `firstName: null` hoặc `lastName: null`
- Frontend cần handle null values (hiển thị username thay thế)

## 📝 Best Practices

### 1. Luôn check nullable trong database
```typescript
// Prisma schema
model User {
  firstName String?  // Nullable
  lastName  String?  // Nullable
}
```

### 2. GraphQL type phải match
```typescript
// GraphQL type phải nullable nếu DB nullable
@Field({ nullable: true })
firstName?: string;
```

### 3. Frontend handling
```tsx
// Component
const authorName = author.firstName && author.lastName
  ? `${author.firstName} ${author.lastName}`
  : author.username;
```

## 🔍 Các type khác đã kiểm tra

✅ **ReviewUserType**: Dùng `fullName?: string` (nullable) - OK
✅ **LMS modules**: Không có firstName/lastName non-nullable - OK
✅ **Các GraphQL types khác**: Không có vấn đề tương tự

## 🚀 Deploy

**Cần restart backend sau khi fix:**
```bash
# Development
bun run dev:backend

# Production (Docker)
./deploy.sh
```

**TypeScript sẽ tự động rebuild khi detect thay đổi.**
