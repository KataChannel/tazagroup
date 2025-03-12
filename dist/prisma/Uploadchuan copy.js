"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = require("fs");
const prisma = new client_1.PrismaClient();
async function importData() {
    const data = JSON.parse(fs.readFileSync('prisma_seed.json', 'utf-8'));
    for (const [model, records] of Object.entries(data)) {
        if (Array.isArray(records) && records.length > 0) {
            try {
                await prisma[model.toLowerCase()].createMany({
                    data: records,
                    skipDuplicates: true,
                });
                console.log(`✅ Đã nhập dữ liệu vào bảng ${model}`);
            }
            catch (error) {
                console.error(`⚠️ Lỗi khi nhập dữ liệu vào bảng ${model}:`, error.message);
            }
        }
    }
    console.log('✅ Hoàn tất nhập dữ liệu!');
    await prisma.$disconnect();
}
importData();
//# sourceMappingURL=Uploadchuan%20copy.js.map