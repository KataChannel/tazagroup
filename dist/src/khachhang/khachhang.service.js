"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KhachhangService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let KhachhangService = class KhachhangService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const prefix = data.loaikh === 'khachsi' ? 'TG-KS' : 'TG-KL';
        const lastCustomer = await this.prisma.khachhang.findFirst({
            where: { makh: { startsWith: prefix } },
            orderBy: { makh: 'desc' },
            select: { makh: true },
        });
        let nextNumber = 1;
        if (lastCustomer) {
            const lastNumber = parseInt(lastCustomer.makh.slice(-5), 10);
            nextNumber = lastNumber + 1;
        }
        const newMakh = `${prefix}${String(nextNumber).padStart(5, '0')}`;
        return this.prisma.khachhang.create({
            data: {
                makh: newMakh,
                loaikh: data.loaikh,
                name: data.name,
                diachi: data.diachi,
                sdt: data.sdt,
                email: data.email,
            },
        });
    }
    async findAll() {
        return this.prisma.khachhang.findMany({
            include: { banggia: true }
        });
    }
    async findOne(id) {
        const khachhang = await this.prisma.khachhang.findUnique({ where: { id } });
        if (!khachhang)
            throw new common_1.NotFoundException('Khachhang not found');
        return khachhang;
    }
    async update(id, data) {
        return this.prisma.khachhang.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.khachhang.delete({ where: { id } });
    }
};
exports.KhachhangService = KhachhangService;
exports.KhachhangService = KhachhangService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KhachhangService);
//# sourceMappingURL=khachhang.service.js.map