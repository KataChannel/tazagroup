import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    create(dto: any): Promise<{
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
    findAll(): Promise<{
        id: string;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        SDT: string | null;
        password: string;
        provider: string | null;
        providerId: string | null;
    }[]>;
    getProfile(req: any): Promise<{
        roles: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        permissions: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        }[];
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
    assignRoleToUser(data: any): Promise<{
        id: string;
        userId: string;
        roleId: string;
    }>;
    removeRoleFromUser(data: any): Promise<{
        id: string;
        userId: string;
        roleId: string;
    }>;
    findOne(id: string): Promise<{
        roles: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        permissions: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        }[];
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
    update(id: string, data: any): Promise<{
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
    remove(id: string): Promise<{
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
}
