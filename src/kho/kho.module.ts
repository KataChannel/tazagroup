import { Module } from '@nestjs/common';
  import { khoService } from './kho.service';
  import { khoController } from './kho.controller';
import { PrismaModule } from 'prisma/prisma.module';
  @Module({
    imports: [PrismaModule],
    controllers: [khoController],
    providers: [khoService],
    exports:[khoService]
  })
  export class khoModule {}