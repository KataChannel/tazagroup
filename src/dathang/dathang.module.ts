import { Module } from '@nestjs/common';
  import { DathangService } from './dathang.service';
  import { DathangController } from './dathang.controller';
import { PrismaModule } from 'prisma/prisma.module';
  @Module({
    imports: [PrismaModule],
    controllers: [DathangController],
    providers: [DathangService],
    exports:[DathangService]
  })
  export class DathangModule {}