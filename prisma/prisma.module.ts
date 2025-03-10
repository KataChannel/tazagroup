import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // Quan trọng: Xuất để module khác có thể sử dụng
})
export class PrismaModule {}