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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const socket_gateway_1 = require("../socket.gateway");
let UserService = class UserService {
    constructor(prisma, _SocketGateway) {
        this.prisma = prisma;
        this._SocketGateway = _SocketGateway;
    }
    async createUser(dto) {
        return this.prisma.user.create({
            data: {
                email: dto.email,
                password: dto.password,
            },
        });
    }
    async getUsers() {
        return this.prisma.user.findMany();
    }
    async findAll() {
        return this.prisma.user.findMany();
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('user not found');
        return {
            ...user,
            roles: user.roles.map((role) => {
                const { permissions, ...rest } = role.role;
                return rest;
            }),
            permissions: Array.from(new Set(user.roles.flatMap((role) => role.role.permissions.map((p) => p.permission)))),
        };
    }
    async update(id, data) {
        this._SocketGateway.senduserUpdate();
        delete data.roles;
        return this.prisma.user.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.user.delete({ where: { id } });
    }
    async assignRoleToUser(data) {
        const { userId, roleId } = data;
        console.log(data);
        const role = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${userId} not found`);
        }
        const permission = await this.prisma.role.findUnique({
            where: { id: roleId },
        });
        if (!permission) {
            throw new common_1.NotFoundException(`Permission with ID ${roleId} not found`);
        }
        return this.prisma.userRole.create({
            data: {
                userId,
                roleId,
            },
        });
    }
    async removeRoleFromUser(data) {
        const { userId, roleId } = data;
        const rolePermission = await this.prisma.userRole.findFirst({
            where: {
                userId,
                roleId,
            },
        });
        if (!rolePermission) {
            throw new common_1.NotFoundException(`Permission with ID ${roleId} is not assigned to Role with ID ${userId}`);
        }
        return this.prisma.userRole.delete({
            where: {
                id: rolePermission.id,
            },
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        socket_gateway_1.SocketGateway])
], UserService);
//# sourceMappingURL=user.service.js.map