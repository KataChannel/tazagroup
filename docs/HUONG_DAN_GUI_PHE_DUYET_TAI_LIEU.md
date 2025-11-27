# Hướng Dẫn Gửi Yêu Cầu Phê Duyệt Tài Liệu Nguồn

## 📍 Vấn Đề Đã Khắc Phục

**Tình huống ban đầu:**
- Giảng viên `testgiangvien1@gmail.com` tạo tài liệu "Kỹ Năng Thuyết Trình"
- Admin `admin@gmail.com` không nhận được yêu cầu phê duyệt
- **Nguyên nhân:** Giảng viên chưa nhấn nút "Gửi yêu cầu phê duyệt"

**Giải pháp:**
- ✅ Đã thêm nút "Gửi yêu cầu phê duyệt" vào trang chi tiết tài liệu
- ✅ Cập nhật GraphQL query để lấy trạng thái approval
- ✅ Tích hợp component `ApprovalRequestButton`

---

## 🎯 Cách Gửi Yêu Cầu Phê Duyệt (Giảng Viên)

### Bước 1: Tạo Tài Liệu Nguồn

1. Đăng nhập với tài khoản giảng viên
2. Vào menu **LMS > Dashboard Giảng viên**
3. Click **Tài liệu nguồn** trong sidebar
4. Click nút **"+ Thêm tài liệu"**

### Bước 2: Điền Thông Tin

1. **Tiêu đề**: Tên tài liệu (bắt buộc)
2. **Mô tả**: Mô tả chi tiết về tài liệu
3. **Loại tài liệu**: FILE, VIDEO, TEXT, AUDIO, LINK, IMAGE
4. **Trạng thái**: Để **DRAFT** (Nháp)
5. **Nội dung**: 
   - Nếu loại TEXT: Nhập nội dung trực tiếp
   - Nếu loại khác: Nhập URL
6. **Danh mục**: Chọn danh mục phù hợp
7. **Tags**: Thêm các tag để dễ tìm kiếm

### Bước 3: Lưu Tài Liệu

1. Click **"Lưu"** hoặc **"Tạo mới"**
2. Hệ thống sẽ tạo tài liệu với trạng thái **DRAFT**
3. Bạn sẽ được chuyển đến trang danh sách hoặc chi tiết

### Bước 4: Gửi Yêu Cầu Phê Duyệt ⭐

**Quan trọng: Đây là bước mà giảng viên thường quên!**

1. Vào **Danh sách tài liệu nguồn**
2. Click vào tài liệu cần phê duyệt
3. Ở trang chi tiết, bên phải tiêu đề có các nút:
   - 🟢 **"Gửi yêu cầu phê duyệt"** (màu xanh) ← **NHẤN VÀO ĐÂY**
   - "Chỉnh sửa"
   - "Xóa"

4. Sau khi nhấn:
   - Toast thông báo: *"Đã gửi yêu cầu phê duyệt tài liệu..."*
   - Nút đổi thành: ✅ **"Đã gửi yêu cầu phê duyệt"** (disabled, màu xám)
   - Admin sẽ nhận được notification

### Bước 5: Theo Dõi Trạng Thái

- **Đã gửi yêu cầu**: Nút hiện ✅ "Đã gửi yêu cầu phê duyệt"
- **Admin đang xem xét**: Chờ admin vào `/lms/admin/approvals`
- **Được phê duyệt**: 
  - Trạng thái đổi thành **PUBLISHED**
  - Badge hiển thị "Đã xuất bản"
  - Tài liệu có thể được sử dụng trong khóa học
- **Bị từ chối**:
  - Trạng thái vẫn **DRAFT**
  - `approvalRequested` reset về `false`
  - Có thể xem lý do từ chối
  - Sửa lại và gửi yêu cầu mới

---

## 🔒 Điều Kiện Gửi Yêu Cầu

Nút "Gửi yêu cầu phê duyệt" chỉ hiển thị khi:

✅ Tài liệu ở trạng thái **DRAFT**
✅ Chưa gửi yêu cầu trước đó (`approvalRequested = false`)
✅ Bạn là chủ sở hữu tài liệu

**Nút sẽ ẩn hoặc disabled khi:**

❌ Tài liệu đã **PUBLISHED** (đã được duyệt)
❌ Tài liệu đã **ARCHIVED**
❌ Đã gửi yêu cầu rồi (hiện nút xám ✅ "Đã gửi yêu cầu phê duyệt")

---

## 👨‍💼 Quy Trình Phê Duyệt (Admin)

### Admin Nhận Thông Báo

Khi giảng viên nhấn "Gửi yêu cầu phê duyệt":

1. **Notification** được tạo cho tất cả admin:
   ```
   Tiêu đề: Yêu cầu phê duyệt tài liệu
   Nội dung: [Tên giảng viên] đã gửi yêu cầu phê duyệt tài liệu "[Tên tài liệu]"
   ```

2. **Push notification** (nếu có subscription)

### Admin Xử Lý Yêu Cầu

1. Admin vào **`/lms/admin/approvals`**
2. Chọn tab **"Tài liệu"**
3. Xem danh sách các tài liệu có `approvalRequested = true`
4. Click "Xem chi tiết" hoặc expand card
5. Chọn:
   - **Phê duyệt**: Tài liệu → PUBLISHED
   - **Từ chối**: Nhập lý do → Reset approval request

---

## 🛠️ Thay Đổi Kỹ Thuật

### 1. Frontend - Component ApprovalRequestButton

**File:** `/frontend/src/components/lms/ApprovalRequestButton.tsx`

Component tái sử dụng cho cả course và document:

```tsx
<ApprovalRequestButton
  type="document"          // hoặc "course"
  id={document.id}         // ID của tài liệu
  title={document.title}   // Tên tài liệu
  approvalRequested={document.approvalRequested}
  status={document.status} // DRAFT, PUBLISHED, etc.
  onSuccess={refetch}      // Callback sau khi gửi thành công
/>
```

**Logic:**
- Nếu `approvalRequested = true` → Hiện nút xám "Đã gửi yêu cầu"
- Nếu `status !== 'DRAFT'` → Ẩn nút
- Click → Gọi mutation → Toast thông báo

### 2. Frontend - Trang Chi Tiết Tài Liệu

**File:** `/frontend/src/app/lms/instructor/source-documents/[id]/page.tsx`

**Thay đổi:**
- Import `ApprovalRequestButton`
- Thêm component vào header (bên cạnh nút "Chỉnh sửa")
- Cập nhật GraphQL query thêm các field:
  ```graphql
  approvalRequested
  approvalRequestedAt
  approvalRequestedBy
  approvedBy
  approvedAt
  rejectionReason
  ```

### 3. GraphQL Query

**File:** `/frontend/src/graphql/lms/source-documents.ts`

**Query `GET_SOURCE_DOCUMENT`** đã được cập nhật:

```graphql
query GetSourceDocument($id: ID!) {
  sourceDocument(id: $id) {
    # ... existing fields
    approvalRequested      # 🆕
    approvalRequestedAt    # 🆕
    approvalRequestedBy    # 🆕
    approvedBy             # 🆕
    approvedAt             # 🆕
    rejectionReason        # 🆕
  }
}
```

### 4. Backend - Service & Resolver

**File:** `/backend/src/lms/source-document/source-document.service.ts`

**Method:** `requestApproval(documentId, userId)`

**Flow:**
1. Kiểm tra document tồn tại
2. Verify quyền sở hữu (`document.userId === userId`)
3. Validate status = DRAFT
4. Validate chưa gửi yêu cầu trước đó
5. Update:
   ```ts
   {
     approvalRequested: true,
     approvalRequestedAt: new Date(),
     approvalRequestedBy: userId,
   }
   ```
6. Query tất cả admin (role `admin` hoặc `ADMIN`)
7. Gửi notification + push cho từng admin
8. Return transformed document

**File:** `/backend/src/lms/source-document/source-document.resolver.ts`

**Mutation:**
```ts
@Mutation(() => SourceDocument)
@UseGuards(JwtAuthGuard)
async requestDocumentApproval(
  @CurrentUser() user: any,
  @Args('documentId', { type: () => ID }) documentId: string,
) {
  return this.sourceDocumentService.requestApproval(documentId, user.id);
}
```

---

## 📊 Schema Database

**Model:** `SourceDocument`

```prisma
model SourceDocument {
  // ... existing fields
  
  // Approval workflow
  approvalRequested   Boolean   @default(false)
  approvalRequestedAt DateTime?
  approvalRequestedBy String?
  approvedBy          String?
  approvedAt          DateTime?
  rejectionReason     String?   @db.Text
}
```

---

## 🧪 Testing

### Test Case 1: Gửi Yêu Cầu Thành Công

```bash
# 1. Chạy script kiểm tra
bun run backend/check-document-approval.ts

# Kết quả mong đợi TRƯỚC khi gửi:
# ❌ Tài liệu CHƯA được gửi yêu cầu phê duyệt
# -> approvalRequested = false
```

```bash
# 2. Giảng viên vào trang chi tiết tài liệu
# 3. Nhấn nút "Gửi yêu cầu phê duyệt"
# 4. Chạy lại script

bun run backend/check-document-approval.ts

# Kết quả mong đợi SAU khi gửi:
# ✅ Tài liệu ĐÃ được gửi yêu cầu phê duyệt
# -> approvalRequested = true
# -> Requested at: 2025-11-26T...
# ✅ Tìm thấy 1 notification(s) liên quan
```

### Test Case 2: Admin Nhận Notification

```bash
# Kiểm tra admin có nhận được notification
bun run backend/check-document-approval.ts

# Kết quả:
# ✅ Tìm thấy 1 notification(s) liên quan:
#    Notification 1:
#    Title: Yêu cầu phê duyệt tài liệu
#    Message: [Giảng viên] đã gửi yêu cầu phê duyệt tài liệu "..."
#    Type: SYSTEM
#    Read: false
```

### Test Case 3: Validation Errors

**Test gửi lại yêu cầu đã gửi:**
- Click nút lần 2 → Toast: "Yêu cầu phê duyệt đã được gửi trước đó"
- Nút hiện ✅ disabled

**Test gửi khi status không phải DRAFT:**
- Đổi status sang PUBLISHED
- Nút "Gửi yêu cầu" ẩn mất

---

## 🐛 Debug Scripts

### 1. Check Document Approval

```bash
bun run backend/check-document-approval.ts
```

**Output:**
- Thông tin tài liệu
- Trạng thái approval
- Notifications của admin
- Roles của admin
- Gợi ý khắc phục

### 2. Check Admin Role

```bash
bun run backend/check-user-giangvien-role.ts
```

Kiểm tra user có role admin trong RBAC system.

---

## 📝 Lưu Ý Quan Trọng

### Cho Giảng Viên:

1. **Không tự động gửi yêu cầu:** Sau khi tạo tài liệu, bạn phải **chủ động nhấn nút** để gửi yêu cầu
2. **Kiểm tra trạng thái:** Chỉ tài liệu DRAFT mới gửi được
3. **Chỉ gửi 1 lần:** Sau khi gửi, nút sẽ disabled. Nếu bị từ chối, có thể gửi lại
4. **Theo dõi notification:** Admin có thể phản hồi qua notification

### Cho Admin:

1. **Kiểm tra role:** Admin phải có role `admin` trong hệ thống RBAC
2. **Vào đúng trang:** `/lms/admin/approvals` tab "Tài liệu"
3. **Filter hiệu quả:** Dùng filter `approvalRequested = true`
4. **Phản hồi kịp thời:** Giảng viên đang chờ phê duyệt

### Cho Developer:

1. **Query admin đúng:** Dùng `userRoles` không phải `roles`
2. **Notification service:** Đảm bảo NotificationService hoạt động
3. **Push notification:** Kiểm tra PushNotificationService
4. **GraphQL schema:** Đồng bộ backend và frontend

---

## 🔗 Files Liên Quan

### Frontend:
- `/frontend/src/app/lms/instructor/source-documents/[id]/page.tsx` ⭐ (Thêm nút)
- `/frontend/src/app/lms/instructor/source-documents/page.tsx` (List)
- `/frontend/src/components/lms/ApprovalRequestButton.tsx` (Component)
- `/frontend/src/graphql/lms/source-documents.ts` (Queries)
- `/frontend/src/app/lms/admin/approvals/page.tsx` (Admin page)

### Backend:
- `/backend/src/lms/source-document/source-document.service.ts` (Logic)
- `/backend/src/lms/source-document/source-document.resolver.ts` (API)
- `/backend/prisma/schema.prisma` (Database)
- `/backend/check-document-approval.ts` ⭐ (Debug tool)

### Documentation:
- `/docs/HUONG_DAN_GUI_PHE_DUYET_TAI_LIEU.md` (Bạn đang đọc)
- `/HE_THONG_PHE_DUYET.md` (Tổng quan hệ thống)
- `/docs/FIX_LMS_INSTRUCTOR_ACCESS.md` (RBAC fix)

---

## ✅ Checklist Hoàn Thành

- [x] Thêm `ApprovalRequestButton` vào trang chi tiết tài liệu
- [x] Cập nhật GraphQL query thêm approval fields
- [x] Test nút gửi yêu cầu phê duyệt
- [x] Verify admin nhận được notification
- [x] Tạo debug script `check-document-approval.ts`
- [x] Viết tài liệu hướng dẫn chi tiết
- [ ] Test end-to-end: Giảng viên gửi → Admin duyệt
- [ ] Gán role admin cho `admin@gmail.com` nếu thiếu

---

## 🎓 Kết Luận

Vấn đề "admin không nhận được yêu cầu phê duyệt" được giải quyết bằng cách:

1. ✅ **Thêm nút UI** để giảng viên gửi yêu cầu
2. ✅ **Hướng dẫn rõ ràng** workflow cho người dùng
3. ✅ **Debug tools** để kiểm tra trạng thái
4. ✅ **Validation** đảm bảo chỉ gửi khi hợp lệ

**Giảng viên chỉ cần:** Tạo tài liệu → Vào chi tiết → Nhấn nút "Gửi yêu cầu phê duyệt" → Chờ admin duyệt ✨
