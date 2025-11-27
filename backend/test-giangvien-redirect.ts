import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testGiangvienRedirect() {
  try {
    console.log('🧪 Testing giangvien redirect logic\n');

    const user = await prisma.user.findFirst({
      where: {
        email: 'testgiangvien1@gmail.com'
      },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      console.log('❌ User not found!');
      return;
    }

    console.log('User Info:');
    console.log('  Email:', user.email);
    console.log('  RoleType:', user.roleType);
    console.log('  Assigned Roles:', user.userRoles.map(ur => ur.role.name).join(', '));

    // Get auth settings
    const settings = await prisma.websiteSetting.findMany({
      where: {
        category: 'AUTH',
        group: 'redirect',
        isActive: true
      }
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value || '';
    });

    console.log('\nAuth Settings:');
    console.log('  auth_role_based_redirect:', settingsMap['auth_role_based_redirect']);
    console.log('  auth_redirect_giangvien:', settingsMap['auth_redirect_giangvien']);
    console.log('  auth_login_redirect:', settingsMap['auth_login_redirect']);

    const roleBasedRedirect = settingsMap['auth_role_based_redirect'] === 'true';
    console.log('\nRole-based redirect enabled:', roleBasedRedirect);

    if (!roleBasedRedirect) {
      console.log('\n⚠️  Role-based redirect is DISABLED!');
      console.log('Will redirect to:', settingsMap['auth_login_redirect'] || '/dashboard');
      return;
    }

    // Test the logic
    const hasGiangvienRole = user.userRoles.some(ur => 
      ur.role.name === 'giangvien' || 
      ur.role.name.toLowerCase() === 'instructor'
    );
    const isInstructor = user.roleType.toUpperCase() === 'INSTRUCTOR';

    console.log('\nRedirect Logic Test:');
    console.log('  hasGiangvienRole:', hasGiangvienRole);
    console.log('  isInstructor (roleType):', isInstructor);
    console.log('  Should redirect to giangvien:', hasGiangvienRole || isInstructor);

    let redirectUrl;
    if (hasGiangvienRole || isInstructor) {
      redirectUrl = settingsMap['auth_redirect_giangvien'] || '/lms/instructor';
      console.log('\n✅ PASS: Will redirect to:', redirectUrl);
    } else {
      // Check roleType fallback
      switch (user.roleType.toUpperCase()) {
        case 'ADMIN':
        case 'SUPERADMIN':
          redirectUrl = settingsMap['auth_redirect_admin'] || '/admin';
          break;
        case 'USER':
          redirectUrl = settingsMap['auth_redirect_user'] || '/dashboard';
          break;
        case 'GUEST':
          redirectUrl = settingsMap['auth_redirect_guest'] || '/courses';
          break;
        default:
          redirectUrl = settingsMap['auth_login_redirect'] || '/dashboard';
      }
      console.log('\n⚠️  Fallback to roleType redirect:', redirectUrl);
    }

    console.log('\n📌 Final Redirect URL:', redirectUrl);
    console.log('\n✅ Test completed! User should redirect to:', redirectUrl);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testGiangvienRedirect();
