import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tazaaffiliate.com' },
    update: {},
    create: {
      email: 'admin@tazaaffiliate.com',
      name: 'Administrator',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '+84901234567',
          country: 'VN',
          city: 'Ho Chi Minh City',
          bio: 'System Administrator'
        }
      }
    }
  })

  // Create sample campaigns
  const campaigns = await Promise.all([
    prisma.campaign.upsert({
      where: { id: 'campaign-1' },
      update: {},
      create: {
        id: 'campaign-1',
        name: 'E-commerce Fashion Sale',
        description: 'Promote the latest fashion trends with up to 50% commission',
        category: 'Fashion',
        commission: 15.0,
        currency: 'VND',
        status: 'ACTIVE',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        url: 'https://example.com/fashion',
        rules: 'Must generate at least 5 sales per month to maintain partnership'
      }
    }),
    prisma.campaign.upsert({
      where: { id: 'campaign-2' },
      update: {},
      create: {
        id: 'campaign-2',
        name: 'Tech Gadgets Affiliate',
        description: 'Latest technology products with competitive commissions',
        category: 'Technology',
        commission: 20.0,
        currency: 'VND',
        status: 'ACTIVE',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-06-30'),
        url: 'https://example.com/tech',
        rules: 'Minimum 10 clicks per week required'
      }
    }),
    prisma.campaign.upsert({
      where: { id: 'campaign-3' },
      update: {},
      create: {
        id: 'campaign-3',
        name: 'Health & Wellness Products',
        description: 'Promote healthy lifestyle products and supplements',
        category: 'Health',
        commission: 25.0,
        currency: 'VND',
        status: 'ACTIVE',
        startDate: new Date('2025-02-01'),
        url: 'https://example.com/health',
        rules: 'Must comply with health product advertising regulations'
      }
    })
  ])

  // Create sample publisher user
  const publisherPassword = await hashPassword('publisher123')
  const publisher = await prisma.user.upsert({
    where: { email: 'publisher@example.com' },
    update: {},
    create: {
      email: 'publisher@example.com',
      name: 'Sample Publisher',
      password: publisherPassword,
      role: 'PUBLISHER',
      isActive: true,
      isVerified: true,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Publisher',
          phone: '+84987654321',
          country: 'VN',
          city: 'Hanoi',
          website: 'https://johnpublisher.com',
          bio: 'Digital marketing specialist with 5+ years experience',
          bankName: 'Vietcombank',
          bankAccount: '1234567890',
          bankOwner: 'John Publisher'
        }
      }
    }
  })

  console.log('✅ Seed completed successfully!')
  console.log(`👤 Admin user: admin@tazaaffiliate.com / admin123`)
  console.log(`👤 Publisher user: publisher@example.com / publisher123`)
  console.log(`📢 Created ${campaigns.length} sample campaigns`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
