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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MenuService = class MenuService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.menu.create({ data });
    }
    async findAll() {
        return this.prisma.menu.findMany({
            include: { children: true },
            orderBy: { order: 'asc' },
        });
    }
    async findOne(id) {
        return this.prisma.menu.findUnique({ where: { id }, include: { children: true } });
    }
    async update(id, data) {
        return this.prisma.menu.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.menu.delete({ where: { id } });
    }
    async getTree(data) {
        if (Object.entries(data).length === 0) {
            data = ['donhang.view'];
        }
        const menus = await this.findAll();
        const filteredMenus = menus.filter(v => {
            const path = v.slug;
            const result = `${path?.split("/").pop()}.view`;
            v.isActive = data?.includes(result);
            return v.isActive;
        });
        const parentIds = new Set(filteredMenus.map(v => v.parentId).filter(id => id));
        const parents = menus.filter(v => parentIds.has(v.id));
        filteredMenus.push(...parents);
        menus.length = 0;
        menus.push(...filteredMenus);
        return this.buildTree(menus);
    }
    buildTree(menus, parentId = null) {
        return menus
            .filter(menu => menu.parentId === parentId)
            .map(menu => ({ ...menu, children: this.buildTree(menus, menu.id) }));
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map