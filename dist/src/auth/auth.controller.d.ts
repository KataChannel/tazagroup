import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: any): any;
    facebookLogin(): Promise<void>;
    facebookCallback(req: any, res: any): any;
    zaloLogin(): Promise<void>;
    zaloCallback(req: any, res: any): any;
    register(body: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        id: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        SDT: string | null;
        password: string;
        provider: string | null;
        providerId: string | null;
    }>;
    login(body: {
        SDT: string;
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: any;
    }>;
    changePassword(req: any, body: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{
        id: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        SDT: string | null;
        password: string;
        provider: string | null;
        providerId: string | null;
    }>;
    randomPassword(req: any): Promise<{
        newPassword: string;
    }>;
}
