// import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
// import { GiohangService } from './giohang.service';

// @Controller('giohang')
// export class GiohangController {
//   constructor(private readonly giohangService: GiohangService) {}

//   @Post()
//   create(@Body() createGiohangDto: any) {
//     return this.giohangService.create(createGiohangDto);
//   }

//   @Get()
//   findAll() {
//     return this.giohangService.findAll();
//   }

//   @Get('findid/:id')
//   findOne(@Param('id') id: string) {
//     return this.giohangService.findOne(id);
//   }
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateGiohangDto: any) {
//     return this.giohangService.update(id, updateGiohangDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.giohangService.remove(id);
//   }
//   @Post('reorder')
//   reorder(@Body() body: { giohangIds: string[] }) {
//     return this.giohangService.reorderGiohangs(body.giohangIds);
//   }
// }