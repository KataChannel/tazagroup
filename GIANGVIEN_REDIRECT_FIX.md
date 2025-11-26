# Sửa lỗi Auth Redirect cho Giảng viên

## Vấn đề
User `testgiangvien1@gmail.com` sau khi đăng nhập không redirect đúng theo cài đặt `auth_redirect_giangvien` của website settings.

## Nguyên nhân
Logic redirect chỉ kiểm tra role assignment `giangvien` nhưng không hỗ trợ `roleType = 'INSTRUCTOR'` (không tồn tại trong enum UserRoleType).

## Giải pháp

### 1. Cập nhật logic redirect (`auth-redirect.utils.ts`)
```typescript
// Kiểm tra cả role assignment VÀ roleType
const hasGiangvienRole = user.userRoles.some(ur => 
  ur.role.name === 'giangvien' || 
  ur.role.name.toLowerCase() === 'instructor'
);
const isInstructor = user.roleType.toUpperCase() === 'INSTRUCTOR';

if (hasGiangvienRole || isInstructor) {
  return settings['auth_redirect_giangvien'] || '/lms/instructor';
}
```

### 2. Thêm SUPERADMIN vào admin redirect
```typescript
case 'ADMIN':
case 'SUPERADMIN':
  return settings['auth_redirect_admin'] || '/admin';
```

## Kết quả kiểm tra

### User testgiangvien1@gmail.com
- **Email**: testgiangvien1@gmail.com
- **RoleType**: USER
- **Assigned Roles**: giangvien
- **Redirect URL**: ✅ `/lms/instructor` (đúng)

### Auth Settings
- `auth_role_based_redirect`: true ✓
- `auth_redirect_giangvien`: /lms/instructor ✓

## Scripts hỗ trợ
1. `check-giangvien-user.ts` - Kiểm tra thông tin user và settings
2. `test-giangvien-redirect.ts` - Test logic redirect

## Lưu ý
- Enum `UserRoleType` chỉ có: ADMIN, USER, GUEST
- Không có INSTRUCTOR trong enum (by design)
- Giảng viên được quản lý qua role assignment, không qua roleType
