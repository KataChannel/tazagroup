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
exports.DathangService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DathangService = class DathangService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async reorderDathangs(dathangIds) {
        for (let i = 0; i < dathangIds.length; i++) {
            await this.prisma.dathang.update({
                where: { id: dathangIds[i] },
                data: { order: i + 1 },
            });
        }
    }
    async findAll() {
        const dathangs = await this.prisma.dathang.findMany({
            include: {
                sanpham: {
                    include: {
                        sanpham: true,
                    },
                },
                nhacungcap: true,
            },
        });
        return dathangs.map((dathang) => ({
            ...dathang,
            sanpham: dathang.sanpham.map((item) => ({
                ...item.sanpham,
                idSP: item.idSP,
                sldat: item.sldat || 0,
                slgiao: item.slgiao || 0,
                slnhan: item.slnhan || 0,
                ttdat: item.ttdat || 0,
                ttgiao: item.ttgiao || 0,
                ttnhan: item.ttnhan || 0,
                ghichu: item.ghichu,
            })),
        }));
    }
    async findOne(id) {
        const dathang = await this.prisma.dathang.findUnique({
            where: { id },
            include: {
                sanpham: {
                    include: {
                        sanpham: true,
                    },
                },
                nhacungcap: true,
            },
        });
        if (!dathang)
            throw new common_1.NotFoundException('Dathang not found');
        return {
            ...dathang,
            sanpham: dathang.sanpham.map((item) => ({
                ...item.sanpham,
                idSP: item.idSP,
                sldat: item.sldat || 0,
                slgiao: item.slgiao || 0,
                slnhan: item.slnhan || 0,
                ttdat: item.ttdat || 0,
                ttgiao: item.ttgiao || 0,
                ttnhan: item.ttnhan || 0,
                ghichu: item.ghichu,
            })),
        };
    }
    async create(data) {
        console.error(data);
        return this.prisma.$transaction(async (prisma) => {
            const newDathang = await prisma.dathang.create({
                data: {
                    title: data.title,
                    type: data.type,
                    madncc: data.madncc,
                    ngaynhan: new Date(data.ngaynhan),
                    ghichu: data.ghichu,
                    nhacungcapId: data.nhacungcapId,
                    order: data.order,
                    isActive: data.isActive,
                    sanpham: {
                        create: data.sanpham.map(sp => ({
                            idSP: sp.id,
                            sldat: sp.sldat,
                            slgiao: sp.slgiao,
                            slnhan: sp.slnhan,
                            ttdat: sp.ttdat || 0,
                            ttgiao: sp.ttgiao || 0,
                            ttnhan: sp.ttnhan || 0,
                            ghichu: sp.ghichu,
                            order: sp.order,
                            isActive: sp.isActive,
                        })),
                    },
                },
                include: { sanpham: true },
            });
            for (const sp of data.sanpham) {
                await prisma.sanpham.update({
                    where: { id: sp.id },
                    data: {
                        soluong: {
                            increment: sp.sldat || 0,
                        },
                    },
                });
            }
            return newDathang;
        });
    }
    async update(id, data) {
        return this.prisma.$transaction(async (prisma) => {
            const oldDathang = await prisma.dathang.findUnique({
                where: { id },
                include: { sanpham: true },
            });
            if (!oldDathang)
                throw new common_1.NotFoundException('Đơn hàng không tồn tại');
            for (const oldSP of oldDathang.sanpham) {
                const existingSP = await prisma.sanpham.findUnique({
                    where: { id: oldSP.idSP },
                });
                if (existingSP) {
                    await prisma.sanpham.update({
                        where: { id: oldSP.idSP },
                        data: {
                            soluong: {
                                decrement: oldSP.sldat || 0,
                            },
                        },
                    });
                }
                else {
                    console.warn(`Skipping update: Product with id ${oldSP.idSP} not found.`);
                }
            }
            const updatedDathang = await prisma.dathang.update({
                where: { id },
                data: {
                    title: data.title,
                    type: data.type,
                    madncc: data.madncc,
                    ngaynhan: new Date(data.ngaynhan),
                    ghichu: data.ghichu,
                    order: data.order,
                    isActive: data.isActive,
                    sanpham: {
                        deleteMany: {},
                        create: data.sanpham.map((sp) => ({
                            idSP: sp.id,
                            sldat: sp.sldat,
                            slgiao: sp.slgiao,
                            slnhan: sp.slnhan,
                            ttdat: sp.ttdat || 0,
                            ttgiao: sp.ttgiao || 0,
                            ttnhan: sp.ttnhan || 0,
                            ghichu: sp.ghichu,
                            order: sp.order,
                            isActive: sp.isActive,
                        })),
                    },
                },
                include: { sanpham: true },
            });
            for (const newSP of data.sanpham) {
                await prisma.sanpham.update({
                    where: { id: newSP.id },
                    data: {
                        soluong: {
                            increment: newSP.sldat || 0,
                        },
                    },
                });
            }
            return updatedDathang;
        });
    }
    async remove(id) {
        return this.prisma.dathang.delete({ where: { id } });
    }
};
exports.DathangService = DathangService;
exports.DathangService = DathangService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DathangService);
//# sourceMappingURL=dathang.service.js.map