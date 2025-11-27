import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 CHECKING USER GIANGVIEN ROLE');
  console.log('='.repeat(70) + '\n');

  const email = 'chikiet88@gmail.com';

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        },
        userPermissions: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!user) {
      console.log(`❌ User not found: ${email}\n`);
      return;
    }

    console.log('📧 User Info:');
    console.log('   Email:', user.email);
    console.log('   Username:', user.username);
    console.log('   ID:', user.id);
    console.log('   roleType:', user.roleType);
    console.log('');

    console.log('🎭 Role Assignments:');
    if (user.userRoles.length === 0) {
      console.log('   ❌ No roles assigned!\n');
    } else {
      user.userRoles.forEach((ra: any) => {
        console.log(`   ✅ ${ra.role.displayName} (${ra.role.name})`);
        console.log(`      Effect: ${ra.effect}`);
        console.log(`      Priority: ${ra.role.priority}`);
        console.log(`      Permissions: ${ra.role.permissions.length}`);
      });
      console.log('');
    }

    console.log('🔑 Direct Permissions:');
    if (user.userPermissions.length === 0) {
      console.log('   No direct permissions\n');
    } else {
      user.userPermissions.forEach((dp: any) => {
        console.log(`   - ${dp.permission.displayName} (${dp.permission.name})`);
        console.log(`     Effect: ${dp.effect}`);
      });
      console.log('');
    }

    // Check specifically for giangvien role
    const hasGiangvienRole = user.userRoles.some((ra: any) => 
      ra.role.name === 'giangvien' && ra.effect === 'allow'
    );

    console.log('🎯 Giangvien Role Check:');
    if (hasGiangvienRole) {
      console.log('   ✅ User HAS giangvien role with ALLOW effect');
      console.log('   → Should see LMS Instructor navigation\n');
      
      // Get giangvien role details
      const giangvienAssignment = user.userRoles.find((ra: any) => 
        ra.role.name === 'giangvien'
      );
      
      if (giangvienAssignment) {
        console.log('   📋 Giangvien Role Details:');
        console.log(`      Display Name: ${giangvienAssignment.role.displayName}`);
        console.log(`      Priority: ${giangvienAssignment.role.priority}`);
        console.log(`      System Role: ${giangvienAssignment.role.isSystemRole}`);
        console.log(`      Active: ${giangvienAssignment.role.isActive}`);
        console.log(`      Permissions Count: ${giangvienAssignment.role.permissions.length}`);
        
        // List some key LMS permissions
        const lmsPermissions = giangvienAssignment.role.permissions
          .filter((rp: any) => rp.permission.name.startsWith('lms:'))
          .slice(0, 10);
        
        if (lmsPermissions.length > 0) {
          console.log('\n   📌 Sample LMS Permissions (first 10):');
          lmsPermissions.forEach((rp: any, index: number) => {
            console.log(`      ${index + 1}. ${rp.permission.displayName}`);
          });
        }
      }
    } else {
      console.log('   ❌ User DOES NOT have giangvien role');
      console.log('   → Will NOT see LMS Instructor navigation');
      console.log('\n   💡 To fix: Assign giangvien role via Admin UI at:');
      console.log('      /admin/users?tab=rbac&subtab=assignments');
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ CHECK COMPLETE');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
