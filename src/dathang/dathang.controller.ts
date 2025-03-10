import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { DathangService } from './dathang.service';

@Controller('dathang')
export class DathangController {
  constructor(private readonly dathangService: DathangService) {}

  @Post()
  create(@Body() createDathangDto: any) {
    return this.dathangService.create(createDathangDto);
  }

  @Get()
  findAll() {
    return this.dathangService.findAll();
  }

  @Get('findid/:id')
  findOne(@Param('id') id: string) {
    return this.dathangService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDathangDto: any) {
    return this.dathangService.update(id, updateDathangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dathangService.remove(id);
  }
  @Post('reorder')
  reorder(@Body() body: { dathangIds: string[] }) {
    return this.dathangService.reorderDathangs(body.dathangIds);
  }
}