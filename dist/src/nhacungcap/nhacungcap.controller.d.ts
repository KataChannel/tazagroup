import { NhacungcapService } from './nhacungcap.service';
export declare class NhacungcapController {
    private readonly nhacungcapService;
    constructor(nhacungcapService: NhacungcapService);
    create(createNhacungcapDto: any): Promise<{
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
    update(id: string, updateNhacungcapDto: any): Promise<{
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
