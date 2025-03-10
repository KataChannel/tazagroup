export function convertXuatnhapton(data: any) {
    const warehouse = new Map();
    console.log(data);
    
    data.forEach(({ khoname, type, sanpham }: any) => {
        const products = warehouse.get(khoname) || new Map();
        sanpham.forEach(({ id, title, soluong, chitiet }: any) => {
            const currentProduct = products.get(id) || { soluong: 0, slnhap: 0, slxuat: 0, title, chitiet: [] };
            if (type === "nhap") {
                currentProduct.slnhap += soluong;
                currentProduct.soluong += soluong;
            } else {
                currentProduct.slxuat += soluong;
                currentProduct.soluong -= soluong;
            }
            currentProduct.chitiet = sanpham.filter((detail: any) => detail.id === id);
            products.set(id, currentProduct);
        });
        warehouse.set(khoname, products);
    });

    const result: { id: string, khoname: string, title: string, slxuat: number, slnhap: number, soluong: number, chitiet: any[] }[] = [];

    warehouse.forEach((products, khoname) => {
        products.forEach(({ soluong, slnhap, slxuat, title, chitiet }, id) => {
            result.push({ id, khoname, title, slxuat, slnhap, soluong, chitiet });
        });
    });

    return result;
}
