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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RoleService = class RoleService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.role.create({ data });
    }
    async findAll() {
        return this.prisma.role.findMany({ include: { permissions: true } });
    }
    async findOne(id) {
        return this.prisma.role.findUnique({ where: { id }, include: { permissions: true } });
    }
    async update(id, data) {
        console.error(data.permissionIds);
        return this.prisma.role.update({
            where: { id },
            data: {
                name: data.name,
            },
            include: { permissions: { include: { permission: true } } }
        });
    }
    async remove(id) {
        return this.prisma.role.delete({ where: { id } });
    }
    async assignPermissionToRole(data) {
        const { roleId, permissionId } = data;
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${roleId} not found`);
        }
        const permission = await this.prisma.permission.findUnique({
            where: { id: permissionId },
        });
        if (!permission) {
            throw new common_1.NotFoundException(`Permission with ID ${permissionId} not found`);
        }
        return this.prisma.rolePermission.create({
            data: {
                roleId,
                permissionId,
            },
        });
    }
    async removePermissionFromRole(data) {
        const { roleId, permissionId } = data;
        const rolePermission = await this.prisma.rolePermission.findFirst({
            where: {
                roleId,
                permissionId,
            },
        });
        if (!rolePermission) {
            throw new common_1.NotFoundException(`Permission with ID ${permissionId} is not assigned to Role with ID ${roleId}`);
        }
        return this.prisma.rolePermission.delete({
            where: {
                id: rolePermission.id,
            },
        });
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoleService);
//# sourceMappingURL=role.service.js.map