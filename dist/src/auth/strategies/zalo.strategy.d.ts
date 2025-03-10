import { AuthService } from '../auth.service';
declare const ZaloStrategy_base: new (...args: [options: import("passport-oauth2").StrategyOptionsWithRequest] | [options: import("passport-oauth2").StrategyOptions]) => import("passport-oauth2") & {
    validate(...args: any[]): unknown;
};
export declare class ZaloStrategy extends ZaloStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<void>;
}
export {};
