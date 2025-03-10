"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = require("fs");
const prisma = new client_1.PrismaClient();
async function exportData() {
    const models = [
        'Banggia',
        'BanggiaKhachhang',
        'Banggiasanpham',
        'Congty',
        'Dathang',
        'Dathangsanpham',
        'Donhang',
        'Donhangsanpham',
        'Khachhang',
        'KhachhangNhom',
        'Kho',
        'Menu',
        'Nhacungcap',
        'Nhomkhachhang',
        'Permission',
        'PhieuKho',
        'PhieuKhoSanpham',
        'Profile',
        'Role',
        'RolePermission',
        'Sanpham',
        'SanphamKho',
        'User',
        'UserRole'
    ];
    let data = {};
    for (const model of models) {
        try {
            console.log(`🔄 Đang lấy dữ liệu từ bảng: ${model}...`);
            data[model] = await prisma[model.toLowerCase()].findMany();
        }
        catch (error) {
            console.error(`⚠️ Lỗi khi lấy dữ liệu từ bảng ${model}:`, error.message);
        }
    }
    (0, fs_1.writeFileSync)(`prisma_seed_${(new Date()).getTime()}.json`, JSON.stringify(data, null, 2));
    console.log('✅ Dữ liệu đã được xuất ra file prisma_seed.json');
    await prisma.$disconnect();
}
exportData();
//# sourceMappingURL=exportData.js.map