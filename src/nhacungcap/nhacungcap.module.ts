import { Module } from '@nestjs/common';
  import { NhacungcapService } from './nhacungcap.service';
  import { NhacungcapController } from './nhacungcap.controller';
import { PrismaModule } from 'prisma/prisma.module';
  @Module({
    imports: [PrismaModule],
    controllers: [NhacungcapController],
    providers: [NhacungcapService],
    exports:[NhacungcapService]
  })
  export class NhacungcapModule {}