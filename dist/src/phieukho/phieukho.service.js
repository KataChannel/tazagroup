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
exports.PhieukhoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const xuatnhapton_utils_1 = require("../shared/utils/xuatnhapton.utils");
let PhieukhoService = class PhieukhoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async xuatnhapton(query) {
        const { khoId, Batdau, Ketthuc } = query;
        const phieuKhos = await this.prisma.phieuKho.findMany({
            where: {
                ...(khoId && { khoId }),
                ngay: {
                    gte: new Date(Batdau),
                    lte: new Date(Ketthuc),
                },
            },
            include: {
                sanpham: { include: { sanpham: true } },
                kho: true,
            },
        });
        const tranData = phieuKhos.map((phieuKho) => ({
            khoname: phieuKho.kho.name,
            maphieu: phieuKho.maphieu,
            ngay: phieuKho.ngay,
            type: phieuKho.type,
            sanpham: phieuKho.sanpham.map((item) => ({
                id: item.id,
                sldat: item.sldat,
                soluong: item.soluong,
                title: item.sanpham.title,
            })),
        }));
        return (0, xuatnhapton_utils_1.convertXuatnhapton)(tranData);
    }
    async findAll() {
        const phieuKhos = await this.prisma.phieuKho.findMany({
            include: {
                sanpham: { include: { sanpham: true } },
                kho: true,
            },
        });
        return phieuKhos.map((phieuKho) => ({
            ...phieuKho,
            sanpham: phieuKho.sanpham.map((item) => ({
                ...item,
                sanpham: item.sanpham,
            })),
        }));
    }
    async findOne(id) {
        const phieuKho = await this.prisma.phieuKho.findUnique({
            where: { id },
            include: {
                sanpham: true,
                kho: true,
            },
        });
        if (!phieuKho)
            throw new common_1.NotFoundException('phieuKho not found');
        return phieuKho;
    }
    async create(data) {
        return this.prisma.$transaction(async (prisma) => {
            const newPhieuKho = await prisma.phieuKho.create({
                data: {
                    maphieu: data.maphieu,
                    ngay: new Date(data.ngay),
                    type: data.type,
                    khoId: data.khoId,
                    ghichu: data.ghichu,
                    isActive: data.isActive ?? true,
                    sanpham: {
                        create: data.sanpham.map((sp) => ({
                            sanphamId: sp.sanphamId,
                            sldat: sp.sldat,
                            soluong: sp.soluong,
                            ghichu: sp.ghichu,
                        })),
                    },
                },
                include: { sanpham: true },
            });
            for (const sp of data.sanpham) {
                await prisma.sanpham.update({
                    where: { id: sp.sanphamId },
                    data: {
                        soluongkho: data.type === 'nhap'
                            ? { increment: sp.soluong }
                            : { decrement: sp.soluong },
                    },
                });
            }
            return newPhieuKho;
        });
    }
    async update(id, data) {
        return this.prisma.$transaction(async (prisma) => {
            const oldPhieuKho = await prisma.phieuKho.findUnique({
                where: { id },
                include: { sanpham: true },
            });
            if (!oldPhieuKho)
                throw new common_1.NotFoundException('Phiếu kho không tồn tại');
            for (const oldSP of oldPhieuKho.sanpham) {
                await prisma.sanpham.update({
                    where: { id: oldSP.sanphamId },
                    data: {
                        soluongkho: oldPhieuKho.type === 'nhap'
                            ? { decrement: oldSP.soluong }
                            : { increment: oldSP.soluong },
                    },
                });
            }
            const updatedPhieuKho = await prisma.phieuKho.update({
                where: { id },
                data: {
                    maphieu: data.maphieu,
                    ngay: new Date(data.ngay),
                    type: data.type,
                    khoId: data.khoId,
                    ghichu: data.ghichu,
                    isActive: data.isActive ?? true,
                    sanpham: {
                        deleteMany: {},
                        create: data.sanpham.map((sp) => ({
                            sanphamId: sp.sanphamId,
                            soluong: sp.soluong,
                            sldat: sp.sldat,
                            ghichu: sp.ghichu,
                        })),
                    },
                },
                include: { sanpham: true },
            });
            for (const newSP of data.sanpham) {
                await prisma.sanpham.update({
                    where: { id: newSP.sanphamId },
                    data: {
                        soluongkho: data.type === 'nhap'
                            ? { increment: newSP.soluong }
                            : { decrement: newSP.soluong },
                    },
                });
            }
            return updatedPhieuKho;
        });
    }
    async remove(id) {
        return this.prisma.phieuKho.delete({ where: { id } });
    }
};
exports.PhieukhoService = PhieukhoService;
exports.PhieukhoService = PhieukhoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PhieukhoService);
//# sourceMappingURL=phieukho.service.js.map