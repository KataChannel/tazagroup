import { DathangService } from './dathang.service';
export declare class DathangController {
    private readonly dathangService;
    constructor(dathangService: DathangService);
    create(createDathangDto: any): Promise<{
        sanpham: {
            id: string;
            ghichu: string | null;
            isActive: boolean;
            order: number | null;
            idSP: string;
            sldat: number | null;
            slgiao: number | null;
            slnhan: number | null;
            ttdat: number | null;
            ttgiao: number | null;
            ttnhan: number | null;
            dathangId: string;
        }[];
    } & {
        id: string;
        ghichu: string | null;
        isActive: boolean;
        title: string | null;
        order: number | null;
        type: string | null;
        madncc: string | null;
        ngaynhan: Date | null;
        nhacungcapId: string;
    }>;
    findAll(): Promise<{
        sanpham: any[];
        nhacungcap: {
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
        };
        id: string;
        ghichu: string | null;
        isActive: boolean;
        title: string | null;
        order: number | null;
        type: string | null;
        madncc: string | null;
        ngaynhan: Date | null;
        nhacungcapId: string;
    }[]>;
    findOne(id: string): Promise<{
        sanpham: {
            idSP: string;
            sldat: number;
            slgiao: number;
            slnhan: number;
            ttdat: number;
            ttgiao: number;
            ttnhan: number;
            ghichu: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string | null;
            order: number | null;
            masp: string;
            giagoc: number;
            dvt: string | null;
            hinhanh: string | null;
            soluong: number;
            soluongkho: number;
            haohut: number;
        }[];
        nhacungcap: {
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
        };
        id: string;
        ghichu: string | null;
        isActive: boolean;
        title: string | null;
        order: number | null;
        type: string | null;
        madncc: string | null;
        ngaynhan: Date | null;
        nhacungcapId: string;
    }>;
    update(id: string, updateDathangDto: any): Promise<{
        sanpham: {
            id: string;
            ghichu: string | null;
            isActive: boolean;
            order: number | null;
            idSP: string;
            sldat: number | null;
            slgiao: number | null;
            slnhan: number | null;
            ttdat: number | null;
            ttgiao: number | null;
            ttnhan: number | null;
            dathangId: string;
        }[];
    } & {
        id: string;
        ghichu: string | null;
        isActive: boolean;
        title: string | null;
        order: number | null;
        type: string | null;
        madncc: string | null;
        ngaynhan: Date | null;
        nhacungcapId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        ghichu: string | null;
        isActive: boolean;
        title: string | null;
        order: number | null;
        type: string | null;
        madncc: string | null;
        ngaynhan: Date | null;
        nhacungcapId: string;
    }>;
    reorder(body: {
        dathangIds: string[];
    }): Promise<void>;
}
