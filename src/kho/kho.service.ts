import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class khoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.kho.create({ data });
  }
  async findAll() {
    return this.prisma.kho.findMany();
  }

  async findOne(id: string) {
    const kho = await this.prisma.kho.findUnique({ where: { id } });
    if (!kho) throw new NotFoundException('kho not found');
    return kho;
  }

  async update(id: string, data: any) {
    return this.prisma.kho.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.kho.delete({ where: { id } });
  }
}