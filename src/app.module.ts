import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { MenuModule } from './menu/menu.module';
import { SanphamModule } from './sanpham/sanpham.module';
import { BanggiaModule } from './banggia/banggia.module';
import { DonhangModule } from './donhang/donhang.module';
import { KhachhangModule } from './khachhang/khachhang.module';
import { NhacungcapModule } from './nhacungcap/nhacungcap.module';
import { DathangModule } from './dathang/dathang.module';
import { khoModule } from './kho/kho.module';
import { PhieukhoModule } from './phieukho/phieukho.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { NhomkhachhangModule } from './nhomkhachhang/nhomkhachhang.module';

@Module({
  imports: [
    AuthModule, 
    UserModule,
    PrismaModule,
    MenuModule,
    SanphamModule,
    BanggiaModule,
    DonhangModule,
    KhachhangModule,
    NhomkhachhangModule,
    NhacungcapModule,
    DathangModule,
    khoModule,
    PhieukhoModule,
    RoleModule,
    PermissionModule
  ],
  controllers: [AppController],
  providers: [AppService,PrismaService],  
  exports: [PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
