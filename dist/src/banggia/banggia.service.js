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
exports.BanggiaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BanggiaService = class BanggiaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        let newOrder;
        const maxOrder = await this.prisma.banggia.aggregate({
            _max: { order: true },
        });
        newOrder = (maxOrder._max?.order || 0) + 1;
        return this.prisma.banggia.create({
            data: {
                ...data,
                order: newOrder,
            },
        });
    }
    async createBanggia(data) {
        console.error(data);
        return this.prisma.banggia.create({
            data: {
                title: data.title,
                type: data.type,
                status: data.status || 'baogia',
                batdau: data.batdau ? new Date(data.batdau) : null,
                ketthuc: data.ketthuc ? new Date(data.ketthuc) : null,
                isActive: data.isActive ?? false,
                sanpham: {
                    create: data.sanpham?.map((sp) => ({
                        sanphamId: sp.id,
                        giaban: sp.giaban,
                    })),
                },
            },
            include: {
                sanpham: true,
            },
        });
    }
    async reorderBanggias(banggiaIds) {
        for (let i = 0; i < banggiaIds.length; i++) {
            await this.prisma.banggia.update({
                where: { id: banggiaIds[i] },
                data: { order: i + 1 },
            });
        }
    }
    async findAll() {
        return this.prisma.banggia.findMany({
            include: {
                sanpham: true,
            },
            orderBy: {
                order: 'asc',
            },
        });
    }
    async findOne(id) {
        const banggia = await this.prisma.banggia.findUnique({
            where: { id },
            include: {
                sanpham: {
                    include: {
                        sanpham: true,
                    },
                },
                khachhang: true,
            },
        });
        if (!banggia) {
            throw new common_1.NotFoundException(`Banggia with ID "${id}" not found`);
        }
        return {
            ...banggia,
            sanpham: banggia.sanpham.map((item) => ({
                ...item.sanpham,
                giaban: item.giaban,
            })),
        };
    }
    async update(id, data) {
        return this.prisma.banggia.update({
            where: { id },
            data: {
                title: data.title,
                isActive: data.isActive,
                type: data.type,
                status: data.status || 'baogia',
                batdau: data.batdau ? new Date(data.batdau) : null,
                ketthuc: data.ketthuc ? new Date(data.ketthuc) : null,
                sanpham: {
                    deleteMany: {},
                    create: data.sanpham?.map((sp) => ({
                        sanphamId: sp.sanphamId,
                        giaban: sp.giaban,
                    })),
                },
            },
            include: {
                sanpham: true,
            },
        });
    }
    async remove(id) {
        return this.prisma.banggia.delete({ where: { id } });
    }
    async addKHtoBG(banggiaId, khachhangIds) {
        return this.prisma.banggia.update({
            where: { id: banggiaId },
            data: {
                khachhang: {
                    connect: khachhangIds.map(id => ({ id })),
                },
            },
        });
    }
    async removeKHfromBG(banggiaId, khachhangIds) {
        return this.prisma.banggia.update({
            where: { id: banggiaId },
            data: {
                khachhang: {
                    disconnect: khachhangIds.map(id => ({ id })),
                },
            },
        });
    }
};
exports.BanggiaService = BanggiaService;
exports.BanggiaService = BanggiaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BanggiaService);
//# sourceMappingURL=banggia.service.js.map