import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SocketGateway } from 'src/socket.gateway';

@Injectable()
export class SanphamService {
  constructor(
    private readonly prisma: PrismaService,
    private _SocketGateway: SocketGateway,
  ) {}

  // async create(data: any) {
  //   return this.prisma.sanpham.create({ data });
  // }
  async getLastUpdatedSanpham() {
    const lastUpdated = await this.prisma.sanpham.aggregate({
      _max: {
        updatedAt: true,
      },
    });
    return { updatedAt: lastUpdated._max.updatedAt || 0 };
  }
  async generateMaSP(): Promise<string> {
    // Lấy NCC mới nhất
    const latest = await this.prisma.sanpham.findFirst({
      orderBy: { masp: 'desc' },
    });

    // Nếu chưa có NCC nào, bắt đầu từ 1
    let nextNumber = 1;
    if (latest) {
      const match = latest.masp.match(/I1(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    // Tạo mã mới dạng TG-NCC00001
    return `I1${nextNumber.toString().padStart(5, '0')}`;
  }
  async create(data: any) {
    let newOrder: number;
    const maxOrder = await this.prisma.sanpham.aggregate({
      _max: { order: true },
    });
    newOrder = (maxOrder._max?.order || 0) + 1;
    // Create the new sanpham entry
    this._SocketGateway.sendSanphamUpdate();
    const masp = await this.generateMaSP();
    return this.prisma.sanpham.create({
      data: {
        ...data,
        order: newOrder,
        masp:masp,
      },
    });
  }

  async reorderSanphams(sanphamIds: string[]) {
    // Update the order of each sanpham based on its position in the array
    for (let i = 0; i < sanphamIds.length; i++) {
      await this.prisma.sanpham.update({
        where: { id: sanphamIds[i] },
        data: { order: i + 1 },
      });
    }
  }
  async findAll() {
    return this.prisma.sanpham.findMany();
  }

  async findOne(id: string) {
    const sanpham = await this.prisma.sanpham.findUnique({ where: { id } });
    if (!sanpham) throw new NotFoundException('Sanpham not found');
    return sanpham;
  }

  async update(id: string, data: any) {
    if(data.order){
      const { order, ...rest } = data;
      await this.prisma.sanpham.update({ where: { id }, data: rest });
      await this.prisma.sanpham.update({ where: { id }, data: { order } });
    }
    this._SocketGateway.sendSanphamUpdate();
    return this.prisma.sanpham.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.sanpham.delete({ where: { id } });
  }
}