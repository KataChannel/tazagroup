"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const prisma_module_1 = require("../prisma/prisma.module");
const prisma_service_1 = require("../prisma/prisma.service");
const menu_module_1 = require("./menu/menu.module");
const sanpham_module_1 = require("./sanpham/sanpham.module");
const banggia_module_1 = require("./banggia/banggia.module");
const donhang_module_1 = require("./donhang/donhang.module");
const khachhang_module_1 = require("./khachhang/khachhang.module");
const nhacungcap_module_1 = require("./nhacungcap/nhacungcap.module");
const dathang_module_1 = require("./dathang/dathang.module");
const kho_module_1 = require("./kho/kho.module");
const phieukho_module_1 = require("./phieukho/phieukho.module");
const auth_middleware_1 = require("./middleware/auth.middleware");
const role_module_1 = require("./role/role.module");
const permission_module_1 = require("./permission/permission.module");
const nhomkhachhang_module_1 = require("./nhomkhachhang/nhomkhachhang.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            prisma_module_1.PrismaModule,
            menu_module_1.MenuModule,
            sanpham_module_1.SanphamModule,
            banggia_module_1.BanggiaModule,
            donhang_module_1.DonhangModule,
            khachhang_module_1.KhachhangModule,
            nhomkhachhang_module_1.NhomkhachhangModule,
            nhacungcap_module_1.NhacungcapModule,
            dathang_module_1.DathangModule,
            kho_module_1.khoModule,
            phieukho_module_1.PhieukhoModule,
            role_module_1.RoleModule,
            permission_module_1.PermissionModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map