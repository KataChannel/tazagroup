import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { ZaloStrategy } from './strategies/zalo.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  providers: [AuthService,GoogleStrategy, FacebookStrategy, ZaloStrategy],
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key', // Đặt secret key
      signOptions: { expiresIn: '30d' }, // Cấu hình thời gian hết hạn
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
