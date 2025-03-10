import { BanggiaService } from './banggia.service';
export declare class BanggiaController {
    private readonly banggiaService;
    constructor(banggiaService: BanggiaService);
    create(createBanggiaDto: any): Promise<{
        sanpham: {
            id: string;
            isActive: boolean;
            order: number | null;
            giaban: number;
            sanphamId: string;
            banggiaId: string;
        }[];
    } & {
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number | null;
        type: string;
        batdau: Date | null;
        ketthuc: Date | null;
        status: string | null;
    }>;
    findAll(): Promise<({
        sanpham: {
            id: string;
            isActive: boolean;
            order: number | null;
            giaban: number;
            sanphamId: string;
            banggiaId: string;
        }[];
    } & {
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number | null;
        type: string;
        batdau: Date | null;
        ketthuc: Date | null;
        status: string | null;
    })[]>;
    addMultipleKhachhangToBanggia(data: any): Promise<{
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number | null;
        type: string;
        batdau: Date | null;
        ketthuc: Date | null;
        status: string | null;
    }>;
    removeKHfromBG(data: any): Promise<{
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number | null;
        type: string;
        batdau: Date | null;
        ketthuc: Date | null;
        status: string | null;
    }>;
    findOne(id: string): Promise<{
        sanpham: {
            giaban: number;
            id: string;
            ghichu: string | null;
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
        khachhang: {
            id: string;
            name: string | null;
            namenn: string | null;
            makh: string;
            diachi: string | null;
            sdt: string | null;
            mst: string | null;
            gionhanhang: string | null;
            quan: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            loaikh: string | null;
            ghichu: string | null;
            hiengia: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number | null;
        type: string;
        batdau: Date | null;
        ketthuc: Date | null;
        status: string | null;
    }>;
    update(id: string, updateBanggiaDto: any): Promise<{
        sanpham: {
            id: string;
            isActive: boolean;
            order: number | null;
            giaban: number;
            sanphamId: string;
            banggiaId: string;
        }[];
    } & {
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number | null;
        type: string;
        batdau: Date | null;
        ketthuc: Date | null;
        status: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number | null;
        type: string;
        batdau: Date | null;
        ketthuc: Date | null;
        status: string | null;
    }>;
    reorder(body: {
        banggiaIds: string[];
    }): Promise<void>;
}
