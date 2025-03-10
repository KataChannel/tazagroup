import { PrismaService } from 'prisma/prisma.service';
export declare class NhacungcapService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generateMancc(): Promise<string>;
    create(data: any): Promise<{
        id: string;
        name: string | null;
        diachi: string | null;
        sdt: string | null;
        email: string | null;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        mancc: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string | null;
        diachi: string | null;
        sdt: string | null;
        email: string | null;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        mancc: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string | null;
        diachi: string | null;
        sdt: string | null;
        email: string | null;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        mancc: string;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string | null;
        diachi: string | null;
        sdt: string | null;
        email: string | null;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        mancc: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string | null;
        diachi: string | null;
        sdt: string | null;
        email: string | null;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        mancc: string;
    }>;
}
