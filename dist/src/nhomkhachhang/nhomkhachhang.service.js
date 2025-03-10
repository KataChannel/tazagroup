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
exports.NhomkhachhangService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let NhomkhachhangService = class NhomkhachhangService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.nhomkhachhang.create({ data });
    }
    async findAll() {
        return this.prisma.nhomkhachhang.findMany({ include: { khachhang: true } });
    }
    async findOne(id) {
        const nhomkhachhang = await this.prisma.nhomkhachhang.findUnique({ where: { id }, include: { khachhang: true } });
        if (!nhomkhachhang)
            throw new common_1.NotFoundException('Nhomkhachhang not found');
        return nhomkhachhang;
    }
    async update(id, data) {
        return this.prisma.nhomkhachhang.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.nhomkhachhang.delete({ where: { id } });
    }
    async addKHtoNhom(nhomId, khachhangIds) {
        return this.prisma.nhomkhachhang.update({
            where: { id: nhomId },
            data: {
                khachhang: {
                    connect: khachhangIds.map(id => ({ id })),
                },
            },
        });
    }
    async removeKHfromNhom(nhomId, khachhangIds) {
        return this.prisma.nhomkhachhang.update({
            where: { id: nhomId },
            data: {
                khachhang: {
                    disconnect: khachhangIds.map(id => ({ id })),
                },
            },
        });
    }
};
exports.NhomkhachhangService = NhomkhachhangService;
exports.NhomkhachhangService = NhomkhachhangService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NhomkhachhangService);
//# sourceMappingURL=nhomkhachhang.service.js.map