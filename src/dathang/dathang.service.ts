import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DathangService {
  constructor(private readonly prisma: PrismaService) {}


  async reorderDathangs(dathangIds: string[]) {
    // Update the order of each dathang based on its position in the array
    for (let i = 0; i < dathangIds.length; i++) {
      await this.prisma.dathang.update({
        where: { id: dathangIds[i] },
        data: { order: i + 1 },
      });
    }
  }
  async findAll() {
    const dathangs = await this.prisma.dathang.findMany({
      include: {
        sanpham: {
          include: {
            sanpham: true,
          },
        },
        nhacungcap: true,
      },
    });
    return dathangs.map((dathang) => ({
      ...dathang,
      sanpham: dathang.sanpham.map((item: any) => ({
        ...item.sanpham,
        idSP: item.idSP,
        sldat: item.sldat|| 0,
        slgiao: item.slgiao|| 0,
        slnhan: item.slnhan|| 0,
        ttdat: item.ttdat|| 0,
        ttgiao: item.ttgiao|| 0,
        ttnhan: item.ttnhan|| 0,
        ghichu: item.ghichu,
      })),
    }));
  }

  async findOne(id: string) {
    // const dathang = await this.prisma.dathang.findUnique({ where: { id } });
    const dathang = await this.prisma.dathang.findUnique({
      where: { id },
      include: {
        sanpham: {
          include: {
            sanpham: true,
          },
        },
        nhacungcap: true,
      },
    });
    if (!dathang) throw new NotFoundException('Dathang not found');
    return {
      ...dathang,
      sanpham: dathang.sanpham.map((item) => ({
        ...item.sanpham,
        idSP: item.idSP,
        sldat: item.sldat|| 0,
        slgiao: item.slgiao|| 0,
        slnhan: item.slnhan|| 0,
        ttdat: item.ttdat|| 0,
        ttgiao: item.ttgiao|| 0,
        ttnhan: item.ttnhan|| 0,
        ghichu: item.ghichu,
      })),
    };
  }


  async create(data: any) {
    console.error(data);
    
    return this.prisma.$transaction(async (prisma) => {
      const newDathang = await prisma.dathang.create({
        data: {
          title: data.title,
          type: data.type,
          madncc: data.madncc,
          ngaynhan: new Date(data.ngaynhan),
          ghichu: data.ghichu,
          nhacungcapId: data.nhacungcapId,
          order: data.order,
          isActive: data.isActive,
          sanpham: {
            create: data.sanpham.map(sp => ({
              idSP: sp.id,
              sldat: sp.sldat,
              slgiao: sp.slgiao,
              slnhan: sp.slnhan,
              ttdat: sp.ttdat || 0,
              ttgiao: sp.ttgiao || 0,
              ttnhan: sp.ttnhan || 0,
              ghichu: sp.ghichu,
              order: sp.order,
              isActive: sp.isActive,
            })),
          },
        },
        include: { sanpham: true },
      });
  
      // Cập nhật số lượng sản phẩm trong kho (tăng số lượng nhận)
      for (const sp of data.sanpham) {
        await prisma.sanpham.update({
          where: { id: sp.id },
          data: {
            soluong: {
              increment: sp.sldat|| 0, // Tăng số lượng sản phẩm nhập về
            },
          },
        });
      }
  
      return newDathang;
    });
  }
  

  async update(id: string, data: any) {
    return this.prisma.$transaction(async (prisma) => {
      // Lấy đơn hàng cũ
      const oldDathang = await prisma.dathang.findUnique({
        where: { id },
        include: { sanpham: true },
      });
  
      if (!oldDathang) throw new NotFoundException('Đơn hàng không tồn tại');

      // Hoàn lại số lượng sản phẩm trong đơn hàng cũ
      for (const oldSP of oldDathang.sanpham) {
        const existingSP = await prisma.sanpham.findUnique({
          where: { id: oldSP.idSP },
        });
      
        if (existingSP) {
          await prisma.sanpham.update({
            where: { id: oldSP.idSP },
            data: {
              soluong: {
                decrement: oldSP.sldat|| 0,
              },
            },
          });
        } else {
          console.warn(`Skipping update: Product with id ${oldSP.idSP} not found.`);
        }
      }
  
      // Cập nhật đơn hàng mới
      const updatedDathang = await prisma.dathang.update({
        where: { id },
        data: {
          title: data.title,
          type: data.type,
          madncc: data.madncc,
          ngaynhan: new Date(data.ngaynhan),
          ghichu: data.ghichu,
          order: data.order,
          isActive: data.isActive,
          sanpham: {
            deleteMany: {}, // Xóa tất cả sản phẩm cũ trước khi thêm mới
            create: data.sanpham.map((sp: any) => ({
              idSP: sp.id,
              sldat: sp.sldat,
              slgiao: sp.slgiao,
              slnhan: sp.slnhan,
              ttdat: sp.ttdat  || 0,
              ttgiao: sp.ttgiao  || 0,
              ttnhan: sp.ttnhan || 0,
              ghichu: sp.ghichu,
              order: sp.order,
              isActive: sp.isActive,
            })),
          },
        },
        include: { sanpham: true },
      });
  
      // Cập nhật số lượng sản phẩm trong kho (tăng số lượng nhận mới)
      for (const newSP of data.sanpham) {
        await prisma.sanpham.update({
          where: { id: newSP.id },
          data: {
            soluong: {
              increment: newSP.sldat|| 0, // Cộng số lượng mới nhận
            },
          },
        });
      }
  
      return updatedDathang;
    });
  }
  
  async remove(id: string) {
    return this.prisma.dathang.delete({ where: { id } });
  }
}