import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { NhomkhachhangService } from './nhomkhachhang.service';

@Controller('nhomkhachhang')
export class NhomkhachhangController {
  constructor(private readonly nhomkhachhangService: NhomkhachhangService) {}

  @Post()
  create(@Body() createNhomkhachhangDto: any) {
    return this.nhomkhachhangService.create(createNhomkhachhangDto);
  }

  @Get()
  findAll() {
    return this.nhomkhachhangService.findAll();
  }
  @Post('addKHtoNhom')
  addMultipleKhachhangToBanggia(@Body() data:any) {
    return this.nhomkhachhangService.addKHtoNhom(data.nhomId,data.khachhangIds);
  }
  @Post('removeKHfromNhom')
  removeKHfromBG(@Body() data:any) {
    return this.nhomkhachhangService.removeKHfromNhom(data.nhomId,data.khachhangIds);
  }
  @Get('findid/:id')
  findOne(@Param('id') id: string) {
    return this.nhomkhachhangService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNhomkhachhangDto: any) {
    return this.nhomkhachhangService.update(id, updateNhomkhachhangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nhomkhachhangService.remove(id);
  }
}