import { Module } from '@nestjs/common';
  import { BanggiaService } from './banggia.service';
  import { BanggiaController } from './banggia.controller';
import { PrismaModule } from 'prisma/prisma.module';
  @Module({
    imports: [PrismaModule],
    controllers: [BanggiaController],
    providers: [BanggiaService],
    exports:[BanggiaService]
  })
  export class BanggiaModule {}