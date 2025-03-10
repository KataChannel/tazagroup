import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { DonhangService } from './donhang.service';

@Controller('donhang')
export class DonhangController {
  constructor(private readonly donhangService: DonhangService) {}

  @Post()
  create(@Body() createDonhangDto: any) {
    return this.donhangService.create(createDonhangDto);
  }
  @Post('search')
  async search(@Body() params: any) {
    return this.donhangService.search(params);
  }
  @Get()
  findAll() {
    return this.donhangService.findAll();
  }

  @Get('findid/:id')
  findOne(@Param('id') id: string) {
    return this.donhangService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonhangDto: any) {
    return this.donhangService.update(id, updateDonhangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donhangService.remove(id);
  }
  @Post('reorder')
  reorder(@Body() body: { donhangIds: string[] }) {
    return this.donhangService.reorderDonHangs(body.donhangIds);
  }
}