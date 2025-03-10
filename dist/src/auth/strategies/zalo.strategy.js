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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaloStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const passport_oauth2_1 = require("passport-oauth2");
const auth_service_1 = require("../auth.service");
let ZaloStrategy = class ZaloStrategy extends (0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, 'zalo') {
    constructor(authService) {
        super({
            authorizationURL: 'https://oauth.zaloapp.com/v4/permission',
            tokenURL: 'https://oauth.zaloapp.com/v4/access_token',
            clientID: process.env.ZALO_APP_ID,
            clientSecret: process.env.ZALO_APP_SECRET,
            callbackURL: `${process.env.SERVER_URL}/auth/zalo/callback`,
            scope: ['profile'],
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { id, name } = profile;
        const user = await this.authService.validateOAuthLogin('zalo', id, name);
        done(null, user);
    }
};
exports.ZaloStrategy = ZaloStrategy;
exports.ZaloStrategy = ZaloStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], ZaloStrategy);
//# sourceMappingURL=zalo.strategy.js.map