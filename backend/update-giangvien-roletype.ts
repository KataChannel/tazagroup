import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateGiangvienRoleType() {
  try {
    console.log('🔄 Updating roleType for testgiangvien1@gmail.com\n');

    // Find all users with giangvien role but USER roleType
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: 'testgiangvien1@gmail.com' },
          { username: 'testgiangvien1' }
        ]
      },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (users.length === 0) {
      console.log('❌ No users found!');
      return;
    }

    for (const user of users) {
      const hasGiangvienRole = user.userRoles.some(ur => ur.role.name === 'giangvien');
      
      if (hasGiangvienRole && user.roleType !== 'INSTRUCTOR') {
        console.log(`Updating user: ${user.email}`);
        console.log(`  Current roleType: ${user.roleType}`);
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            roleType: 'INSTRUCTOR'
          }
        });
        
        console.log(`  ✅ Updated to: INSTRUCTOR\n`);
      } else if (hasGiangvienRole) {
        console.log(`User ${user.email} already has INSTRUCTOR roleType ✓`);
      } else {
        console.log(`User ${user.email} does not have giangvien role`);
      }
    }

    console.log('✅ Update completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateGiangvienRoleType();
