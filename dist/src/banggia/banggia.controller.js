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
exports.BanggiaController = void 0;
const common_1 = require("@nestjs/common");
const banggia_service_1 = require("./banggia.service");
let BanggiaController = class BanggiaController {
    constructor(banggiaService) {
        this.banggiaService = banggiaService;
    }
    create(createBanggiaDto) {
        return this.banggiaService.createBanggia(createBanggiaDto);
    }
    findAll() {
        return this.banggiaService.findAll();
    }
    addMultipleKhachhangToBanggia(data) {
        return this.banggiaService.addKHtoBG(data.banggiaId, data.khachhangIds);
    }
    removeKHfromBG(data) {
        return this.banggiaService.removeKHfromBG(data.banggiaId, data.khachhangIds);
    }
    findOne(id) {
        return this.banggiaService.findOne(id);
    }
    update(id, updateBanggiaDto) {
        return this.banggiaService.update(id, updateBanggiaDto);
    }
    remove(id) {
        return this.banggiaService.remove(id);
    }
    reorder(body) {
        return this.banggiaService.reorderBanggias(body.banggiaIds);
    }
};
exports.BanggiaController = BanggiaController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BanggiaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BanggiaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('addKHtoBG'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BanggiaController.prototype, "addMultipleKhachhangToBanggia", null);
__decorate([
    (0, common_1.Post)('removeKHfromBG'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BanggiaController.prototype, "removeKHfromBG", null);
__decorate([
    (0, common_1.Get)('findid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BanggiaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BanggiaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BanggiaController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BanggiaController.prototype, "reorder", null);
exports.BanggiaController = BanggiaController = __decorate([
    (0, common_1.Controller)('banggia'),
    __metadata("design:paramtypes", [banggia_service_1.BanggiaService])
], BanggiaController);
//# sourceMappingURL=banggia.controller.js.map