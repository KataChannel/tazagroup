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
exports.NhacungcapController = void 0;
const common_1 = require("@nestjs/common");
const nhacungcap_service_1 = require("./nhacungcap.service");
let NhacungcapController = class NhacungcapController {
    constructor(nhacungcapService) {
        this.nhacungcapService = nhacungcapService;
    }
    create(createNhacungcapDto) {
        return this.nhacungcapService.create(createNhacungcapDto);
    }
    findAll() {
        return this.nhacungcapService.findAll();
    }
    findOne(id) {
        return this.nhacungcapService.findOne(id);
    }
    update(id, updateNhacungcapDto) {
        return this.nhacungcapService.update(id, updateNhacungcapDto);
    }
    remove(id) {
        return this.nhacungcapService.remove(id);
    }
};
exports.NhacungcapController = NhacungcapController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NhacungcapController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NhacungcapController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('findid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NhacungcapController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NhacungcapController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NhacungcapController.prototype, "remove", null);
exports.NhacungcapController = NhacungcapController = __decorate([
    (0, common_1.Controller)('nhacungcap'),
    __metadata("design:paramtypes", [nhacungcap_service_1.NhacungcapService])
], NhacungcapController);
//# sourceMappingURL=nhacungcap.controller.js.map