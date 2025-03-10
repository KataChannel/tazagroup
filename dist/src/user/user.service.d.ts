import { PrismaService } from 'prisma/prisma.service';
import { SocketGateway } from 'src/socket.gateway';
export declare class UserService {
    private prisma;
    private _SocketGateway;
    constructor(prisma: PrismaService, _SocketGateway: SocketGateway);
    createUser(dto: any): Promise<{
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
    getUsers(): Promise<{
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
    assignRoleToUser(data: {
        userId: string;
        roleId: any;
    }): Promise<{
        id: string;
        userId: string;
        roleId: string;
    }>;
    removeRoleFromUser(data: {
        userId: string;
        roleId: any;
    }): Promise<{
        id: string;
        userId: string;
        roleId: string;
    }>;
}
