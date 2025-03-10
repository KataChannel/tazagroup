import { Module } from '@nestjs/common';
  import { PhieukhoService } from './phieukho.service';
  import { PhieukhoController } from './phieukho.controller';
import { PrismaModule } from 'prisma/prisma.module';
  @Module({
    imports: [PrismaModule],
    controllers: [PhieukhoController],
    providers: [PhieukhoService],
    exports:[PhieukhoService]
  })
  export class PhieukhoModule {}