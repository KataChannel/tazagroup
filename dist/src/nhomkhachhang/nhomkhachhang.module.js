"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NhomkhachhangModule = void 0;
const common_1 = require("@nestjs/common");
const nhomkhachhang_service_1 = require("./nhomkhachhang.service");
const nhomkhachhang_controller_1 = require("./nhomkhachhang.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
let NhomkhachhangModule = class NhomkhachhangModule {
};
exports.NhomkhachhangModule = NhomkhachhangModule;
exports.NhomkhachhangModule = NhomkhachhangModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [nhomkhachhang_controller_1.NhomkhachhangController],
        providers: [nhomkhachhang_service_1.NhomkhachhangService],
        exports: [nhomkhachhang_service_1.NhomkhachhangService]
    })
], NhomkhachhangModule);
//# sourceMappingURL=nhomkhachhang.module.js.map