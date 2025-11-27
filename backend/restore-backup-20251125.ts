import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres@116.118.49.243:12003/tazagroupcore'
    }
  }
});

const BACKUP_DIR = 'backups/tazagroup/20251125_012515';

async function restoreData() {
  console.log('🔄 Starting restore from', BACKUP_DIR);
  
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));
  console.log(`📁 Found ${files.length} backup files`);
  
  // Order matters - restore in dependency order
  const orderedTables = [
    'users',
    'Role',
    'Permission',
    'UserRoleAssignment',
    'RolePermission',
    'categories',
    'tags',
    'Page',
    'posts',
    'post_tags',
    'comments',
    'likes',
    'reviews',
    'menus',
    'website_settings',
    'course_categories',
    'courses',
    'course_modules',
    'lessons',
    'enrollments',
    'lesson_progress',
    'quizzes',
    'questions',
    'answers',
    'source_document_categories',
    'course_source_documents',
    'projects',
    'project_members',
    'project_chat_messages',
    'tasks',
    'carts',
    'aff_users',
    'aff_campaigns',
    'aff_links',
    'aff_campaign_affiliates',
    'aff_clicks',
    'aff_conversions',
    'aff_payment_requests',
    'call_center_config',
    'auth_methods',
    'ext_listhoadon',
    'ext_detailhoadon',
    'ext_sanphamhoadon',
    'audit_logs'
  ];
  
  let restored = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const tableName of orderedTables) {
    const fileName = `${tableName}.json`;
    const filePath = path.join(BACKUP_DIR, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${tableName} - file not found`);
      skipped++;
      continue;
    }
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      if (!data || data.length === 0) {
        console.log(`⏭️  Skipping ${tableName} - no data`);
        skipped++;
        continue;
      }
      
      console.log(`📥 Restoring ${tableName} (${data.length} records)...`);
      
      // Delete existing data first
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE`);
      
      // Restore data in batches
      const batchSize = 100;
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        await (prisma as any)[tableName].createMany({
          data: batch,
          skipDuplicates: true
        });
      }
      
      console.log(`✅ Restored ${tableName} - ${data.length} records`);
      restored++;
      
    } catch (error: any) {
      console.error(`❌ Error restoring ${tableName}:`, error.message);
      errors++;
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Restore Summary:');
  console.log(`  ✅ Restored: ${restored} tables`);
  console.log(`  ⏭️  Skipped: ${skipped} tables`);
  console.log(`  ❌ Errors: ${errors} tables`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n✅ Restore completed!');
}

restoreData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
