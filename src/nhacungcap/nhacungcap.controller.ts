import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { NhacungcapService } from './nhacungcap.service';

@Controller('nhacungcap')
export class NhacungcapController {
  constructor(private readonly nhacungcapService: NhacungcapService) {}

  @Post()
  create(@Body() createNhacungcapDto: any) {
    return this.nhacungcapService.create(createNhacungcapDto);
  }

  @Get()
  findAll() {
    return this.nhacungcapService.findAll();
  }

  @Get('findid/:id')
  findOne(@Param('id') id: string) {
    return this.nhacungcapService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNhacungcapDto: any) {
    return this.nhacungcapService.update(id, updateNhacungcapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nhacungcapService.remove(id);
  }
}