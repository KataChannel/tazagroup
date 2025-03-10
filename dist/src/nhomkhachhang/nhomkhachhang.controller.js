"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NhomkhachhangController = void 0;
const common_1 = require("@nestjs/common");
const nhomkhachhang_service_1 = require("./nhomkhachhang.service");
let NhomkhachhangController = class NhomkhachhangController {
    constructor(nhomkhachhangService) {
        this.nhomkhachhangService = nhomkhachhangService;
    }
    create(createNhomkhachhangDto) {
        return this.nhomkhachhangService.create(createNhomkhachhangDto);
    }
    findAll() {
        return this.nhomkhachhangService.findAll();
    }
    addMultipleKhachhangToBanggia(data) {
        return this.nhomkhachhangService.addKHtoNhom(data.nhomId, data.khachhangIds);
    }
    removeKHfromBG(data) {
        return this.nhomkhachhangService.removeKHfromNhom(data.nhomId, data.khachhangIds);
    }
    findOne(id) {
        return this.nhomkhachhangService.findOne(id);
    }
    update(id, updateNhomkhachhangDto) {
        return this.nhomkhachhangService.update(id, updateNhomkhachhangDto);
    }
    remove(id) {
        return this.nhomkhachhangService.remove(id);
    }
};
exports.NhomkhachhangController = NhomkhachhangController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NhomkhachhangController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NhomkhachhangController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('addKHtoNhom'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NhomkhachhangController.prototype, "addMultipleKhachhangToBanggia", null);
__decorate([
    (0, common_1.Post)('removeKHfromNhom'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NhomkhachhangController.prototype, "removeKHfromBG", null);
__decorate([
    (0, common_1.Get)('findid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NhomkhachhangController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NhomkhachhangController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NhomkhachhangController.prototype, "remove", null);
exports.NhomkhachhangController = NhomkhachhangController = __decorate([
    (0, common_1.Controller)('nhomkhachhang'),
    __metadata("design:paramtypes", [nhomkhachhang_service_1.NhomkhachhangService])
], NhomkhachhangController);
//# sourceMappingURL=nhomkhachhang.controller.js.map