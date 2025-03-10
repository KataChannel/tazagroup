import { Module } from '@nestjs/common';
  import { NhomkhachhangService } from './nhomkhachhang.service';
  import { NhomkhachhangController } from './nhomkhachhang.controller';
import { PrismaModule } from 'prisma/prisma.module';
  @Module({
    imports: [PrismaModule],
    controllers: [NhomkhachhangController],
    providers: [NhomkhachhangService],
    exports:[NhomkhachhangService]
  })
  export class NhomkhachhangModule {}