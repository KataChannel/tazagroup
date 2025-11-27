import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkGiangvienUser() {
  try {
    console.log('🔍 Checking user: testgiangvien1@gmail.com\n');

    const user = await prisma.user.findFirst({
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

    if (!user) {
      console.log('❌ User not found!');
      console.log('Creating test user...\n');

      // Create user with INSTRUCTOR roleType
      const newUser = await prisma.user.create({
        data: {
          email: 'testgiangvien1@gmail.com',
          username: 'testgiangvien1',
          password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // password: password123
          roleType: 'INSTRUCTOR',
          isActive: true,
          isVerified: true,
          firstName: 'Test',
          lastName: 'Giảng Viên',
        }
      });

      console.log('✅ User created successfully!');
      console.log('ID:', newUser.id);
      console.log('Email:', newUser.email);
      console.log('Username:', newUser.username);
      console.log('RoleType:', newUser.roleType);
      console.log('\n📝 You can login with:');
      console.log('Email: testgiangvien1@gmail.com');
      console.log('Password: password123');
      return;
    }

    console.log('✅ User found!');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Username:', user.username);
    console.log('RoleType:', user.roleType);
    console.log('IsActive:', user.isActive);
    console.log('IsVerified:', user.isVerified);
    console.log('\nAssigned Roles:', user.userRoles.length);
    
    if (user.userRoles.length > 0) {
      user.userRoles.forEach((ur, index) => {
        console.log(`  ${index + 1}. ${ur.role.displayName || ur.role.name} (${ur.role.name})`);
      });
    } else {
      console.log('  (No assigned roles)');
    }

    // Check auth settings
    console.log('\n📋 Checking auth redirect settings...');
    const settings = await prisma.websiteSetting.findMany({
      where: {
        category: 'AUTH',
        group: 'redirect'
      }
    });

    console.log('\nAuth Settings:');
    settings.forEach(s => {
      console.log(`  ${s.key}: ${s.value} (Active: ${s.isActive})`);
    });

    // Check if user needs roleType update
    if (user.roleType !== 'INSTRUCTOR') {
      console.log('\n⚠️  User roleType is not INSTRUCTOR!');
      console.log('Current roleType:', user.roleType);
      console.log('\nDo you want to update roleType to INSTRUCTOR? (Run update script)');
    } else {
      console.log('\n✅ User has correct roleType: INSTRUCTOR');
      console.log('Should redirect to: /lms/instructor');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkGiangvienUser();
