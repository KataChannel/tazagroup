import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(@Body() createPermissionDto: any) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get('findid/:id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: any) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}