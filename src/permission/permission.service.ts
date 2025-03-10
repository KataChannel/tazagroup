import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.permission.create({ data });
  }

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({ where: { id } });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(id: string, data: any) {
    return this.prisma.permission.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.permission.delete({ where: { id } });
  }
}