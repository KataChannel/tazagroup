import { Module } from '@nestjs/common';
  import { DonhangService } from './donhang.service';
  import { DonhangController } from './donhang.controller';
import { PrismaModule } from 'prisma/prisma.module';
  @Module({
    imports: [PrismaModule],
    controllers: [DonhangController],
    providers: [DonhangService],
    exports:[DonhangService]
  })
  export class DonhangModule {}