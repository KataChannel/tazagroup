export function convertXuatnhapton(data: any) {
    const warehouse = new Map();
    console.log(data);
    
    data.forEach(({ khoname, type, sanpham, chitiet }: any) => {
        const products = warehouse.get(khoname) || new Map();
        sanpham.forEach(({ id, sl }: any) => {
            const product = products.get(id) || { sl: 0, chitiet: [] };
            product.sl += sl * (type === "nhap" ? 1 : -1);
            product.chitiet.push({ type, sl, chitiet });
            products.set(id, product);
        });
        warehouse.set(khoname, products);
    });

    return [...warehouse].map(([khoname, products]) => ({
        khoname,
        sanpham: [...products].map(([id, { sl, chitiet }]) => ({ id, sl, chitiet })).filter(({ sl }) => sl > 0)
    }));
}