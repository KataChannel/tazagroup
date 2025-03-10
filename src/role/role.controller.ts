import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { RoleService } from './role.service';
@Controller('role')
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: any) {
    return this.rolesService.create(createRoleDto);
  }
  @Post('assign')
  async assignPermissionToRole(@Body() data: any) {
    return this.rolesService.assignPermissionToRole(data);
  }

  @Delete('remove')
  async removePermissionFromRole(@Body() data: any) {
    return this.rolesService.removePermissionFromRole(data);
  }
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: any) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
