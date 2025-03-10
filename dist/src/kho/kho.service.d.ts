import { PrismaService } from 'prisma/prisma.service';
export declare class khoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        name: string;
        diachi: string | null;
        sdt: string | null;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        makho: string | null;
        congtyId: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        diachi: string | null;
        sdt: string | null;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        makho: string | null;
        congtyId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        diachi: string | null;
        sdt: string | null;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        makho: string | null;
        congtyId: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        diachi: string | null;
        sdt: string | null;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        makho: string | null;
        congtyId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        diachi: string | null;
        sdt: string | null;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        makho: string | null;
        congtyId: string | null;
    }>;
}
