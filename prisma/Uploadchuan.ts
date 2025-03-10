import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function importData() {
  const data = JSON.parse(fs.readFileSync('prisma_seed.json', 'utf-8'));

  for (const [model, records] of Object.entries(data)) {
    if (Array.isArray(records) && records.length > 0) {
      try {
        await prisma[model.toLowerCase()].createMany({
          data: records,
          skipDuplicates: true, // Bỏ qua nếu trùng
        });
        console.log(`✅ Đã nhập dữ liệu vào bảng ${model}`);
      } catch (error) {
        console.error(`⚠️ Lỗi khi nhập dữ liệu vào bảng ${model}:`, error.message);
      }
    }
  }

  console.log('✅ Hoàn tất nhập dữ liệu!');
  await prisma.$disconnect();
}

importData();
