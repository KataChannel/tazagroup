// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';

// @Injectable()
// export class GiohangService {
//   constructor(private readonly prisma: PrismaService) {}

//   // async create(data: any) {
//   //   return this.prisma.giohang.create({ data });
//   // }
//   async create(data: any) {
//     return this.prisma.giohang.create({
//       data: {
//         title: data.title,
//         donhangId: data.donhangId || null,
//         isActive: data.isActive,
//         dathangId: data.dathangId || null,
//         order: data.order,
//         donhang: data.donhang,
//         dathang: data.dathang,
//         sanpham: {
//           create: data.sanpham.map((sp: any) => ({
//             idSP: sp.idSP,
//             title: sp.title,
//             sldat: sp.sldat,
//             slgiao: sp.slgiao,
//             slnhan: sp.slnhan,
//             ttdat: sp.ttdat,
//             ttgiao: sp.ttgiao,
//             ttnhan: sp.ttnhan
//           }))
//         }
//       },
//       include: { sanpham: true } // Trả về danh sách sản phẩm trong giỏ hàng
//     });
//   }

//   async reorderGiohangs(giohangIds: string[]) {
//     // Update the order of each giohang based on its position in the array
//     for (let i = 0; i < giohangIds.length; i++) {
//       await this.prisma.giohang.update({
//         where: { id: giohangIds[i] },
//         data: { order: i + 1 },
//       });
//     }
//   }
//   async findAll() {
//     return this.prisma.giohang.findMany();
//   }

//   async findOne(id: string) {
//     const giohang = await this.prisma.giohang.findUnique({ where: { id } });
//     if (!giohang) throw new NotFoundException('Giohang not found');
//     return giohang;
//   }

//   async update(id: string, data: any) {
//     return this.prisma.giohang.update({ where: { id }, data });
//   }

//   async remove(id: string) {
//     return this.prisma.giohang.delete({ where: { id } });
//   }
// }