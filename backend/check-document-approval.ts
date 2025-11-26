import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDocumentApproval() {
  console.log('🔍 Kiểm tra tài liệu "Kỹ Năng Thuyết Trình"...\n');

  // 1. Tìm tài liệu nguồn
  const document = await prisma.sourceDocument.findFirst({
    where: {
      title: {
        contains: 'Kỹ Năng Thuyết Trình',
        mode: 'insensitive',
      },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!document) {
    console.log('❌ Không tìm thấy tài liệu "Kỹ Năng Thuyết Trình"');
    return;
  }

  console.log('✅ Tìm thấy tài liệu:');
  console.log('   ID:', document.id);
  console.log('   Title:', document.title);
  console.log('   Status:', document.status);
  console.log('   Approval Requested:', document.approvalRequested);
  console.log('   Approval Requested At:', document.approvalRequestedAt);
  console.log('   Approval Requested By:', document.approvalRequestedBy);
  console.log('   Approved By:', document.approvedBy);
  console.log('   Approved At:', document.approvedAt);
  console.log('   Author:', document.user.email);
  console.log('   Created:', document.createdAt);
  console.log();

  // 2. Kiểm tra trạng thái yêu cầu phê duyệt
  if (!document.approvalRequested) {
    console.log('❌ Tài liệu CHƯA được gửi yêu cầu phê duyệt');
    console.log('   -> approvalRequested = false');
    console.log('   -> Giảng viên cần nhấn nút "Gửi yêu cầu phê duyệt"');
    console.log();
  } else {
    console.log('✅ Tài liệu ĐÃ được gửi yêu cầu phê duyệt');
    console.log('   -> approvalRequested = true');
    console.log('   -> Requested at:', document.approvalRequestedAt);
    console.log();
  }

  // 3. Tìm user admin
  const admin = await prisma.user.findUnique({
    where: {
      email: 'admin@gmail.com',
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  if (!admin) {
    console.log('❌ Không tìm thấy admin@gmail.com');
    return;
  }

  console.log('✅ Admin user:');
  console.log('   ID:', admin.id);
  console.log('   Email:', admin.email);
  console.log();

  // 4. Kiểm tra notifications của admin
  const notifications = await prisma.notification.findMany({
    where: {
      userId: admin.id,
      OR: [
        {
          title: {
            contains: 'Kỹ Năng Thuyết Trình',
            mode: 'insensitive',
          },
        },
        {
          message: {
            contains: 'Kỹ Năng Thuyết Trình',
            mode: 'insensitive',
          },
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  if (notifications.length > 0) {
    console.log(`✅ Tìm thấy ${notifications.length} notification(s) liên quan:`);
    notifications.forEach((notif, idx) => {
      console.log(`\n   Notification ${idx + 1}:`);
      console.log('   ID:', notif.id);
      console.log('   Title:', notif.title);
      console.log('   Message:', notif.message?.substring(0, 100));
      console.log('   Type:', notif.type);
      console.log('   Read:', notif.isRead);
      console.log('   Created:', notif.createdAt);
    });
    console.log();
  } else {
    console.log('❌ KHÔNG có notification nào gửi đến admin');
    console.log();
  }

  // 5. Kiểm tra tất cả notifications của admin gần đây
  const recentNotifications = await prisma.notification.findMany({
    where: {
      userId: admin.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  console.log(`📋 10 notification gần nhất của admin:`);
  if (recentNotifications.length === 0) {
    console.log('   (Không có notification nào)');
  } else {
    recentNotifications.forEach((notif, idx) => {
      console.log(`   ${idx + 1}. [${notif.type}] ${notif.title} - ${notif.createdAt.toISOString()}`);
    });
  }
  console.log();

  // 6. Kiểm tra role của admin
  const adminRoles = await prisma.userRoleAssignment.findMany({
    where: {
      userId: admin.id,
      effect: 'allow',
    },
    include: {
      role: {
        select: {
          name: true,
          displayName: true,
        },
      },
    },
  });

  console.log('👤 Roles của admin:');
  if (adminRoles.length === 0) {
    console.log('   ❌ Admin không có role nào!');
  } else {
    adminRoles.forEach(assignment => {
      console.log(`   - ${assignment.role.name} (${assignment.role.displayName})`);
    });
  }
  console.log();

  // 7. Kiểm tra xem có admin nào khác không
  const allAdmins = await prisma.user.findMany({
    where: {
      userRoles: {
        some: {
          role: {
            name: 'admin',
          },
          effect: 'allow',
        },
      },
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  console.log(`👥 Tất cả admin trong hệ thống (${allAdmins.length}):`);
  allAdmins.forEach(a => {
    console.log(`   - ${a.email} (${a.username})`);
  });
  console.log();

  // 8. Gợi ý giải pháp
  console.log('💡 PHÂN TÍCH:');
  if (!document.approvalRequested) {
    console.log('   ⚠️  Tài liệu chưa được gửi yêu cầu phê duyệt');
    console.log('   → Giảng viên cần nhấn nút "Gửi yêu cầu phê duyệt" trên giao diện');
    console.log('   → Hoặc gọi mutation: requestDocumentApproval(documentId: "...")');
  } else if (notifications.length === 0) {
    console.log('   ⚠️  Yêu cầu phê duyệt tồn tại nhưng không có notification');
    console.log('   → Có thể lỗi trong NotificationService');
    console.log('   → Hoặc query admin users không đúng (đã fix: dùng userRoles thay vì roles)');
    console.log('   → Service code cần check lại logic gửi notification');
  } else {
    console.log('   ✅ Hệ thống hoạt động bình thường');
    console.log('   → Admin đã nhận được notification');
    console.log('   → Admin cần vào trang /lms/admin/approvals để xem yêu cầu');
  }
}

checkDocumentApproval()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
