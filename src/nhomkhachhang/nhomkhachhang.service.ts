import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class NhomkhachhangService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.nhomkhachhang.create({ data });
  }
  async findAll() {
    return this.prisma.nhomkhachhang.findMany({include:{khachhang:true}});
  }

  async findOne(id: string) {
    const nhomkhachhang = await this.prisma.nhomkhachhang.findUnique({ where: { id },include:{khachhang:true} });
    if (!nhomkhachhang) throw new NotFoundException('Nhomkhachhang not found');
    return nhomkhachhang;
  }

  async update(id: string, data: any) {
    return this.prisma.nhomkhachhang.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.nhomkhachhang.delete({ where: { id } });
  }

  async addKHtoNhom(nhomId: string, khachhangIds: any[]) {
    return this.prisma.nhomkhachhang.update({
      where: { id: nhomId },
      data: {
        khachhang: {
          connect: khachhangIds.map(id => ({ id })),
        },
      },
    });
  }
  async removeKHfromNhom(nhomId: string, khachhangIds: any[]) {
    return this.prisma.nhomkhachhang.update({
      where: { id: nhomId },
      data: {
        khachhang: {
          disconnect: khachhangIds.map(id => ({ id })),
        },
      },
    });
  }
}