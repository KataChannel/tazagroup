import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { khoService } from './kho.service';

@Controller('kho')
export class khoController {
  constructor(private readonly khoService: khoService) {}

  @Post()
  create(@Body() createkhoDto: any) {
    return this.khoService.create(createkhoDto);
  }

  @Get()
  findAll() {
    return this.khoService.findAll();
  }

  @Get('findid/:id')
  findOne(@Param('id') id: string) {
    return this.khoService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatekhoDto: any) {
    return this.khoService.update(id, updatekhoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.khoService.remove(id);
  }
}