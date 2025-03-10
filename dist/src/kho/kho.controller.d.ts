import { khoService } from './kho.service';
export declare class khoController {
    private readonly khoService;
    constructor(khoService: khoService);
    create(createkhoDto: any): Promise<{
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
    update(id: string, updatekhoDto: any): Promise<{
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
