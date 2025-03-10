import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SanphamService } from './sanpham.service';

@Controller('sanpham')
export class SanphamController {
  constructor(private readonly sanphamService: SanphamService) {}

  @Post()
  create(@Body() createSanphamDto: any) {
    return this.sanphamService.create(createSanphamDto);
  }

  @Get()
  findAll() {
    return this.sanphamService.findAll();
  }
  @Get('last-updated')
    async getLastUpdatedSanpham() {
      return this.sanphamService.getLastUpdatedSanpham();
  }
  @Get('findid/:id')
  findOne(@Param('id') id: string) {
    return this.sanphamService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSanphamDto: any) {
    return this.sanphamService.update(id, updateSanphamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sanphamService.remove(id);
  }
  @Post('reorder')
  reorder(@Body() body: { sanphamIds: string[] }) {
    return this.sanphamService.reorderSanphams(body.sanphamIds);
  }
}