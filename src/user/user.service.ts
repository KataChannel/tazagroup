import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { permission } from 'process';
import { Role } from 'src/role/entities/role.entity';
import { SocketGateway } from 'src/socket.gateway';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private _SocketGateway: SocketGateway,
  ) {}

  async createUser(dto: any) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password, // Hash password in real app
      },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }
  async findAll() {
    return this.prisma.user.findMany();
  }



  
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: { include: { role: { include: { permissions: {include:{permission:true}} } } } },
      },
    });
    if (!user) throw new NotFoundException('user not found');
    return {
      ...user,
      roles: user.roles.map((role) => {
        const { permissions, ...rest } = role.role;
        return rest;
      }),
      permissions: Array.from(new Set(user.roles.flatMap((role) => role.role.permissions.map((p) => p.permission)))),
    };
  }

  async update(id: string, data: any) {
    this._SocketGateway.senduserUpdate();
    delete data.roles;
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
  async assignRoleToUser(data: { userId: string; roleId: any }) {
    const { userId, roleId } = data;
    console.log(data);

    const role = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${userId} not found`);
    }
    const permission = await this.prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${roleId} not found`);
    }
    return this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }
  async removeRoleFromUser(data: { userId: string; roleId: any }) {
    const { userId, roleId } = data;
    // Check if the role-permission relationship exists
    const rolePermission = await this.prisma.userRole.findFirst({
      where: {
        userId,
        roleId,
      },
    });
    if (!rolePermission) {
      throw new NotFoundException(
        `Permission with ID ${roleId} is not assigned to Role with ID ${userId}`,
      );
    }
    // Remove permission from role
    return this.prisma.userRole.delete({
      where: {
        id: rolePermission.id,
      },
    });
  }
}
