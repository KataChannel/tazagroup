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
exports.DonhangService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DonhangService = class DonhangService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateNextOrderCode() {
        const lastOrder = await this.prisma.donhang.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        let nextCode = 'TG-AA00001';
        if (lastOrder) {
            nextCode = this.incrementOrderCode(lastOrder.madonhang);
        }
        return nextCode;
    }
    incrementOrderCode(orderCode) {
        const prefix = 'TG-';
        const letters = orderCode.slice(3, 5);
        const numbers = parseInt(orderCode.slice(5), 10);
        let newLetters = letters;
        let newNumbers = numbers + 1;
        if (newNumbers > 99999) {
            newNumbers = 1;
            newLetters = this.incrementLetters(letters);
        }
        return `${prefix}${newLetters}${newNumbers.toString().padStart(5, '0')}`;
    }
    incrementLetters(letters) {
        let firstChar = letters.charCodeAt(0);
        let secondChar = letters.charCodeAt(1);
        if (secondChar === 90) {
            if (firstChar === 90)
                return 'ZZ';
            firstChar++;
            secondChar = 65;
        }
        else {
            secondChar++;
        }
        return String.fromCharCode(firstChar) + String.fromCharCode(secondChar);
    }
    async reorderDonHangs(donhangIds) {
        for (let i = 0; i < donhangIds.length; i++) {
            await this.prisma.donhang.update({
                where: { id: donhangIds[i] },
                data: { order: i + 1 },
            });
        }
    }
    async search(params) {
        const { Batdau, Ketthuc, Type, pageSize, pageNumber } = params;
        const result = await this.prisma.donhang.findMany({
            where: {
                ngaygiao: {
                    gte: Batdau ? new Date(Batdau) : undefined,
                    lte: Ketthuc ? new Date(Ketthuc) : undefined,
                },
                type: Type,
            },
            include: {
                sanpham: {
                    include: {
                        sanpham: true,
                    },
                },
                khachhang: true,
            },
            orderBy: { ngaygiao: 'desc' },
        });
        return result.map((donhang) => ({
            ...donhang,
            sanpham: donhang.sanpham.map((item) => ({
                ...item.sanpham,
                idSP: item.idSP,
                sldat: item.sldat,
                slgiao: item.slgiao,
                slnhan: item.slnhan,
                ttdat: item.ttdat,
                ttgiao: item.ttgiao,
                ttnhan: item.ttnhan,
                ghichu: item.ghichu,
            })),
            name: donhang.khachhang.name,
        }));
    }
    async findAll() {
        const donhangs = await this.prisma.donhang.findMany({
            include: {
                sanpham: {
                    include: {
                        sanpham: true,
                    },
                },
                khachhang: true,
            },
        });
        return donhangs.map((donhang) => ({
            ...donhang,
            sanpham: donhang.sanpham.map((item) => ({
                ...item.sanpham,
                idSP: item.idSP,
                sldat: item.sldat,
                slgiao: item.slgiao,
                slnhan: item.slnhan,
                ttdat: item.ttdat,
                ttgiao: item.ttgiao,
                ttnhan: item.ttnhan,
                ghichu: item.ghichu,
            })),
            name: donhang.khachhang.name,
        }));
    }
    async findOne(id) {
        const donhang = await this.prisma.donhang.findUnique({
            where: { id },
            include: {
                sanpham: {
                    include: {
                        sanpham: true,
                    },
                },
                khachhang: { include: { banggia: { include: { sanpham: true } } }, },
            },
        });
        if (!donhang)
            throw new common_1.NotFoundException('DonHang not found');
        return {
            ...donhang,
            sanpham: donhang.sanpham.map((item) => ({
                ...item.sanpham,
                idSP: item.idSP,
                giaban: donhang.khachhang.banggia.find((bg) => donhang.ngaygiao && bg.batdau && bg.ketthuc && donhang.ngaygiao >= bg.batdau && donhang.ngaygiao <= bg.ketthuc)?.sanpham.find((sp) => sp.sanphamId === item.idSP)?.giaban,
                sldat: item.sldat,
                slgiao: item.slgiao,
                slnhan: item.slnhan,
                ttdat: item.ttdat,
                ttgiao: item.ttgiao,
                ttnhan: item.ttnhan,
                ghichu: item.ghichu,
            })),
        };
    }
    async create(dto) {
        const madonhang = await this.generateNextOrderCode();
        return this.prisma.$transaction(async (prisma) => {
            const newDonhang = await prisma.donhang.create({
                data: {
                    title: dto.title,
                    type: dto.type,
                    madonhang: madonhang,
                    ngaygiao: new Date(dto.ngaygiao),
                    khachhangId: dto.khachhangId,
                    isActive: dto.isActive,
                    order: dto.order,
                    ghichu: dto.ghichu,
                    sanpham: {
                        create: dto?.sanpham?.map((sp) => ({
                            idSP: sp.id,
                            ghichu: sp.ghichu,
                            sldat: sp.sldat ?? 0,
                            slgiao: sp.slgiao ?? 0,
                            slnhan: sp.slnhan ?? 0,
                            ttdat: sp.ttdat ?? 0,
                            ttgiao: sp.ttgiao ?? 0,
                            ttnhan: sp.ttnhan ?? 0,
                        })),
                    },
                },
                include: {
                    sanpham: true,
                },
            });
            for (const sp of dto.sanpham) {
                await prisma.sanpham.update({
                    where: { id: sp.id },
                    data: {
                        soluong: {
                            decrement: sp.sldat ?? 0,
                        },
                    },
                });
            }
            return newDonhang;
        });
    }
    async update(id, data) {
        return this.prisma.$transaction(async (prisma) => {
            const oldDonhang = await prisma.donhang.findUnique({
                where: { id },
                include: { sanpham: true },
            });
            if (!oldDonhang)
                throw new Error('Đơn hàng không tồn tại');
            for (const oldSP of oldDonhang.sanpham) {
                await prisma.sanpham.update({
                    where: { id: oldSP.idSP },
                    data: {
                        soluong: {
                            increment: oldSP.sldat ?? 0,
                        },
                    },
                });
            }
            const updatedDonhang = await prisma.donhang.update({
                where: { id },
                data: {
                    title: data.title,
                    type: data.type,
                    madonhang: data.madonhang,
                    ngaygiao: new Date(data.ngaygiao),
                    khachhangId: data.khachhangId,
                    isActive: data.isActive,
                    status: data.status,
                    order: data.order,
                    ghichu: data.ghichu,
                    sanpham: {
                        deleteMany: {},
                        create: data?.sanpham?.map((sp) => ({
                            idSP: sp.id,
                            ghichu: sp.ghichu,
                            sldat: sp.sldat ?? 0,
                            slgiao: sp.slgiao ?? 0,
                            slnhan: sp.slnhan ?? 0,
                            ttdat: sp.ttdat ?? 0,
                            ttgiao: sp.ttgiao ?? 0,
                            ttnhan: sp.ttnhan ?? 0,
                        })),
                    },
                },
                include: {
                    sanpham: true,
                },
            });
            for (const newSP of data.sanpham) {
                await prisma.sanpham.update({
                    where: { id: newSP.id },
                    data: {
                        soluong: {
                            decrement: newSP.sldat ?? 0,
                        },
                    },
                });
            }
            return updatedDonhang;
        });
    }
    async remove(id) {
        return this.prisma.donhang.delete({ where: { id } });
    }
};
exports.DonhangService = DonhangService;
exports.DonhangService = DonhangService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DonhangService);
//# sourceMappingURL=donhang.service.js.map