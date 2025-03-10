"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NhacungcapModule = void 0;
const common_1 = require("@nestjs/common");
const nhacungcap_service_1 = require("./nhacungcap.service");
const nhacungcap_controller_1 = require("./nhacungcap.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
let NhacungcapModule = class NhacungcapModule {
};
exports.NhacungcapModule = NhacungcapModule;
exports.NhacungcapModule = NhacungcapModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [nhacungcap_controller_1.NhacungcapController],
        providers: [nhacungcap_service_1.NhacungcapService],
        exports: [nhacungcap_service_1.NhacungcapService]
    })
], NhacungcapModule);
//# sourceMappingURL=nhacungcap.module.js.map