import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.menu.create({ data });
  }

  async findAll() {
    return this.prisma.menu.findMany({
      include: { children: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.menu.findUnique({ where: { id }, include: { children: true } });
  }

  async update(id: string, data: any) {
    return this.prisma.menu.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.menu.delete({ where: { id } });
  }

  async getTree(data:any){   
    if(Object.entries(data).length === 0){
      data =['donhang.view'];
    }
    const menus = await this.findAll();  
    const filteredMenus = menus.filter(v => {
      const path = v.slug;
      const result = `${path?.split("/").pop()}.view`;
      v.isActive = data?.includes(result);
      return v.isActive;
    });
    const parentIds = new Set(filteredMenus.map(v => v.parentId).filter(id => id));
    const parents = menus.filter(v => parentIds.has(v.id));
    filteredMenus.push(...parents);
    menus.length = 0;
    menus.push(...filteredMenus);    
    return this.buildTree(menus);
  }

  private buildTree(menus: any[], parentId: string | null = null) {
    return menus
      .filter(menu => menu.parentId === parentId)
      .map(menu => ({ ...menu, children: this.buildTree(menus, menu.id) }));
  }
}
