import { PhieukhoService } from './phieukho.service';
export declare class PhieukhoController {
    private readonly phieukhoService;
    constructor(phieukhoService: PhieukhoService);
    create(createPhieukhoDto: any): Promise<{
        sanpham: {
            id: string;
            ghichu: string | null;
            createdAt: Date;
            updatedAt: Date;
            soluong: number;
            sanphamId: string;
            sldat: number;
            phieuKhoId: string;
        }[];
    } & {
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        khoId: string;
        maphieu: string;
        ngay: Date;
    }>;
    findAll(): Promise<{
        sanpham: {
            sanpham: {
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
            };
            id: string;
            ghichu: string | null;
            createdAt: Date;
            updatedAt: Date;
            soluong: number;
            sanphamId: string;
            sldat: number;
            phieuKhoId: string;
        }[];
        kho: {
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
        };
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        khoId: string;
        maphieu: string;
        ngay: Date;
    }[]>;
    xuatnhapton(query: any): Promise<{
        id: string;
        khoname: string;
        title: string;
        slxuat: number;
        slnhap: number;
        soluong: number;
        chitiet: any[];
    }[]>;
    findOne(id: string): Promise<{
        kho: {
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
        };
        sanpham: {
            id: string;
            ghichu: string | null;
            createdAt: Date;
            updatedAt: Date;
            soluong: number;
            sanphamId: string;
            sldat: number;
            phieuKhoId: string;
        }[];
    } & {
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        khoId: string;
        maphieu: string;
        ngay: Date;
    }>;
    update(id: string, updatePhieukhoDto: any): Promise<{
        sanpham: {
            id: string;
            ghichu: string | null;
            createdAt: Date;
            updatedAt: Date;
            soluong: number;
            sanphamId: string;
            sldat: number;
            phieuKhoId: string;
        }[];
    } & {
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        khoId: string;
        maphieu: string;
        ngay: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        ghichu: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        khoId: string;
        maphieu: string;
        ngay: Date;
    }>;
}
