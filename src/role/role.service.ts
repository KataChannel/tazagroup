import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { permission } from 'process';
@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.role.create({ data });
  }

  async findAll() {
    return this.prisma.role.findMany({ include: { permissions: true }  });
  }

  async findOne(id: string) {
    return this.prisma.role.findUnique({ where: { id }, include: { permissions: true } });
  }

  async update(id: string, data: { name?: string; permissionIds?: string[] }) {
    console.error(data.permissionIds);
    
    return this.prisma.role.update({
      where: { id },
      data: {
        name: data.name,
      },
      include: { permissions: { include: { permission: true } } }
    });
  }
  

  async remove(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }

  async assignPermissionToRole(data: any) {
    const { roleId, permissionId } = data;

    // Check if role exists
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Check if permission exists
    const permission = await this.prisma.permission.findUnique({
      where: { id: permissionId },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${permissionId} not found`);
    }

    // Assign permission to role
    return this.prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
    
  }

  async removePermissionFromRole(data: any) {
    const { roleId, permissionId } = data;

    // Check if the role-permission relationship exists
    const rolePermission = await this.prisma.rolePermission.findFirst({
      where: {
        roleId,
        permissionId,
      },
    });
    if (!rolePermission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} is not assigned to Role with ID ${roleId}`,
      );
    }

    // Remove permission from role
    return this.prisma.rolePermission.delete({
      where: {
        id: rolePermission.id,
      },
    });
  }

}
