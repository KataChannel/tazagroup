import { Module } from '@nestjs/common';
  import { KhachhangService } from './khachhang.service';
  import { KhachhangController } from './khachhang.controller';
import { PrismaModule } from 'prisma/prisma.module';
  @Module({
    imports: [PrismaModule],
    controllers: [KhachhangController],
    providers: [KhachhangService],
    exports:[KhachhangService]
  })
  export class KhachhangModule {}