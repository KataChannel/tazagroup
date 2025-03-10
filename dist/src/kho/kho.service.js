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
exports.khoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let khoService = class khoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.kho.create({ data });
    }
    async findAll() {
        return this.prisma.kho.findMany();
    }
    async findOne(id) {
        const kho = await this.prisma.kho.findUnique({ where: { id } });
        if (!kho)
            throw new common_1.NotFoundException('kho not found');
        return kho;
    }
    async update(id, data) {
        return this.prisma.kho.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.kho.delete({ where: { id } });
    }
};
exports.khoService = khoService;
exports.khoService = khoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], khoService);
//# sourceMappingURL=kho.service.js.map