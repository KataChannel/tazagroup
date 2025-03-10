import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BanggiaService {
  constructor(private readonly prisma: PrismaService) {}

  // async create(data: any) {
  //   return this.prisma.banggia.create({ data });
  // }
  async create(data: any) {
    let newOrder: number;
    const maxOrder = await this.prisma.banggia.aggregate({
      _max: { order: true },
    });
    newOrder = (maxOrder._max?.order || 0) + 1;
    // Create the new sanpham entry
    return this.prisma.banggia.create({
      data: {
        ...data,
        order: newOrder,
      },
    });
  }
  async createBanggia(data: any) {
    console.error(data);
    
    return this.prisma.banggia.create({
      data: {
        title: data.title,
        type: data.type,
        status: data.status||'baogia',
        batdau: data.batdau ? new Date(data.batdau) : null,
        ketthuc: data.ketthuc ? new Date(data.ketthuc) : null,
        isActive: data.isActive ?? false,
        sanpham: {
          create: data.sanpham?.map((sp:any) => ({
            sanphamId: sp.id,
            giaban: sp.giaban,
          })),
        },
      },
      include: {
        sanpham: true,
      },
    });
  }

  async reorderBanggias(banggiaIds: string[]) {
    // Update the order of each banggia based on its position in the array
    for (let i = 0; i < banggiaIds.length; i++) {
      await this.prisma.banggia.update({
        where: { id: banggiaIds[i] },
        data: { order: i + 1 },
      });
    }
  }
  async findAll() {
    return this.prisma.banggia.findMany({
      include: {
        sanpham: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const banggia = await this.prisma.banggia.findUnique({
      where: { id },
      include: {
        sanpham: {
          include: {
            sanpham: true, // Lấy đầy đủ thông tin sản phẩm
          },
        },
        khachhang: true,
      },
    });
    if (!banggia) {
      throw new NotFoundException(`Banggia with ID "${id}" not found`);
    }
    return {
      ...banggia,
      sanpham: banggia.sanpham.map((item) => ({
        ...item.sanpham, // Gộp thông tin sản phẩm vào cùng object
        giaban: item.giaban,
      })),
      
    }
  }

  async update(id: string, data: any) {
    return this.prisma.banggia.update({
      where: { id },
      data: {
        title: data.title,
        isActive: data.isActive,
        type: data.type,
        status: data.status||'baogia',
        batdau: data.batdau ? new Date(data.batdau) : null,
        ketthuc: data.ketthuc ? new Date(data.ketthuc) : null,
        sanpham: {
          deleteMany: {}, // Xóa tất cả sản phẩm cũ trước khi cập nhật
          create: data.sanpham?.map((sp:any) => ({
            sanphamId: sp.sanphamId,
            giaban: sp.giaban,
          })),
        },
      },
      include: {
        sanpham: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.banggia.delete({ where: { id } });
  }



  async addKHtoBG(banggiaId: string, khachhangIds: any[]) {
    return this.prisma.banggia.update({
      where: { id: banggiaId },
      data: {
        khachhang: {
          connect: khachhangIds.map(id => ({ id })),
        },
      },
    });
  }
  async removeKHfromBG(banggiaId: string, khachhangIds: any[]) {
    return this.prisma.banggia.update({
      where: { id: banggiaId },
      data: {
        khachhang: {
          disconnect: khachhangIds.map(id => ({ id })),
        },
      },
    });
  }
}
