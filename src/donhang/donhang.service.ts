import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DonhangService {
  constructor(private readonly prisma: PrismaService) {}

  async generateNextOrderCode(): Promise<string> {
    // Lấy mã đơn hàng gần nhất
    const lastOrder = await this.prisma.donhang.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let nextCode = 'TG-AA00001'; // Mã đầu tiên

    if (lastOrder) {
      nextCode = this.incrementOrderCode(lastOrder.madonhang);
    }
    return nextCode;
  }

  private incrementOrderCode(orderCode: string): string {
    const prefix = 'TG-';
    const letters = orderCode.slice(3, 5); // Lấy AA → ZZ
    const numbers = parseInt(orderCode.slice(5), 10); // Lấy 00001 → 99999

    let newLetters = letters;
    let newNumbers = numbers + 1;

    if (newNumbers > 99999) {
      newNumbers = 1; // Reset về 00001
      newLetters = this.incrementLetters(letters);
    }

    return `${prefix}${newLetters}${newNumbers.toString().padStart(5, '0')}`;
  }

  private incrementLetters(letters: string): string {
    let firstChar = letters.charCodeAt(0);
    let secondChar = letters.charCodeAt(1);

    if (secondChar === 90) { // 'Z'
      if (firstChar === 90) return 'ZZ'; // Giới hạn cuối cùng
      firstChar++;
      secondChar = 65; // Reset về 'A'
    } else {
      secondChar++;
    }

    return String.fromCharCode(firstChar) + String.fromCharCode(secondChar);
  }


  async reorderDonHangs(donhangIds: string[]) {
    // Update the order of each donhang based on its position in the array
    for (let i = 0; i < donhangIds.length; i++) {
      await this.prisma.donhang.update({
        where: { id: donhangIds[i] },
        data: { order: i + 1 },
      });
    }
  }

  async search(params: any) {
    const { Batdau, Ketthuc, Type, pageSize, pageNumber } = params;
    const result =await this.prisma.donhang.findMany({
      where: {
        ngaygiao: {
          gte: Batdau ? new Date(Batdau) : undefined,
          lte: Ketthuc ? new Date(Ketthuc) : undefined,
        },
        type: Type,
      },
      include: {
        sanpham: {
          include: {
            sanpham: true,
          },
        },
        khachhang: true,
      },
      orderBy: { ngaygiao: 'desc' },
    });
    return result.map((donhang) => ({
      ...donhang,
      sanpham: donhang.sanpham.map((item: any) => ({
        ...item.sanpham,
        idSP: item.idSP,
        sldat: item.sldat,
        slgiao: item.slgiao,
        slnhan: item.slnhan,
        ttdat: item.ttdat,
        ttgiao: item.ttgiao,
        ttnhan: item.ttnhan,
        ghichu: item.ghichu,
      })),
      name: donhang.khachhang.name,
    }));
  }
  
  async findAll() {
    const donhangs = await this.prisma.donhang.findMany({
      include: {
        sanpham: {
          include: {
            sanpham: true,
          },
        },
        khachhang: true,
      },
    });
    return donhangs.map((donhang) => ({
      ...donhang,
      sanpham: donhang.sanpham.map((item: any) => ({
        ...item.sanpham,
        idSP: item.idSP,
        sldat: item.sldat,
        slgiao: item.slgiao,
        slnhan: item.slnhan,
        ttdat: item.ttdat,
        ttgiao: item.ttgiao,
        ttnhan: item.ttnhan,
        ghichu: item.ghichu,
      })),
      name: donhang.khachhang.name,
    }));
  }

  async findOne(id: string) {
    // const donhang = await this.prisma.donhang.findUnique({ where: { id } });
    const donhang = await this.prisma.donhang.findUnique({
      where: { id },
      include: {
        sanpham: {
          include: {
            sanpham: true,
          },
        },
        khachhang: {include: {banggia: {include: {sanpham: true}}},},
      },
    });
    if (!donhang) throw new NotFoundException('DonHang not found');
    return {
      ...donhang,
      sanpham: donhang.sanpham.map((item) => ({
        ...item.sanpham,
        idSP: item.idSP,
        giaban: donhang.khachhang.banggia.find((bg) => donhang.ngaygiao && bg.batdau && bg.ketthuc && donhang.ngaygiao >= bg.batdau && donhang.ngaygiao <= bg.ketthuc)?.sanpham.find((sp) => sp.sanphamId === item.idSP)?.giaban,
        sldat: item.sldat,
        slgiao: item.slgiao,
        slnhan: item.slnhan,
        ttdat: item.ttdat,
        ttgiao: item.ttgiao,
        ttnhan: item.ttnhan,
        ghichu: item.ghichu,
      })),
    };
  }


  
  async create(dto: any) {
    const madonhang = await this.generateNextOrderCode();
    return this.prisma.$transaction(async (prisma) => {
      const newDonhang = await prisma.donhang.create({
        data: {
          title: dto.title,
          type: dto.type,
          madonhang: madonhang,
          ngaygiao: new Date(dto.ngaygiao),
          khachhangId: dto.khachhangId,
          isActive: dto.isActive,
          order: dto.order,
          ghichu: dto.ghichu,
          sanpham: {
            create: dto?.sanpham?.map((sp: any) => ({
              idSP: sp.id,
              ghichu: sp.ghichu,
              sldat: sp.sldat ?? 0,
              slgiao: sp.slgiao ?? 0,
              slnhan: sp.slnhan ?? 0,
              ttdat: sp.ttdat ?? 0,
              ttgiao: sp.ttgiao ?? 0,
              ttnhan: sp.ttnhan ?? 0,
            })),
          },
        },
        include: {
          sanpham: true,
        },
      });
  
      // Cập nhật số lượng sản phẩm
      for (const sp of dto.sanpham) {
        await prisma.sanpham.update({
          where: { id: sp.id },
          data: {
            soluong: {
              decrement: sp.sldat ?? 0, // Giảm số lượng khi đặt hàng
            },
          },
        });
      }
  
      return newDonhang;
    });
  }

  
  async update(id: string, data: any) {
    return this.prisma.$transaction(async (prisma) => {
      // Lấy đơn hàng cũ
      const oldDonhang = await prisma.donhang.findUnique({
        where: { id },
        include: { sanpham: true },
      });
  
      if (!oldDonhang) throw new Error('Đơn hàng không tồn tại');
  
      // Hoàn lại số lượng sản phẩm cũ
      for (const oldSP of oldDonhang.sanpham) {
        await prisma.sanpham.update({
          where: { id: oldSP.idSP },
          data: {
            soluong: {
              increment: oldSP.sldat ?? 0, // Hoàn trả số lượng cũ trước khi trừ đi số mới
            },
          },
        });
      }
  
      // Cập nhật đơn hàng
      const updatedDonhang = await prisma.donhang.update({
        where: { id },
        data: {
          title: data.title,
          type: data.type,
          madonhang: data.madonhang,
          ngaygiao: new Date(data.ngaygiao),
          khachhangId: data.khachhangId,
          isActive: data.isActive,
          status: data.status,
          order: data.order,
          ghichu: data.ghichu,
          sanpham: {
            deleteMany: {}, // Xóa tất cả sản phẩm cũ trước khi thêm mới
            create: data?.sanpham?.map((sp: any) => ({
              idSP: sp.id,
              ghichu: sp.ghichu,
              sldat: sp.sldat ?? 0,
              slgiao: sp.slgiao ?? 0,
              slnhan: sp.slnhan ?? 0,
              ttdat: sp.ttdat ?? 0,
              ttgiao: sp.ttgiao ?? 0,
              ttnhan: sp.ttnhan ?? 0,
            })),
          },
        },
        include: {
          sanpham: true,
        },
      });
  
      // Cập nhật lại số lượng sản phẩm mới
      for (const newSP of data.sanpham) {
        await prisma.sanpham.update({
          where: { id: newSP.id },
          data: {
            soluong: {
              decrement: newSP.sldat ?? 0, // Giảm số lượng theo số mới đặt hàng
            },
          },
        });
      }
  
      return updatedDonhang;
    });
  }
  

  async remove(id: string) {
    return this.prisma.donhang.delete({ where: { id } });
  }
}
