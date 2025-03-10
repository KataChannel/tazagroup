npx bun add @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
npx bun add @prisma/client
npx bun add -d prisma
npx bun prisma migrate dev --name rau2.2.5
npx prisma db push
npx bun prisma generate
npx ts-node prisma/exportData.ts


npx prisma db seed
npx katacreate --type nestjs --name menu --outputDir menu
npx katacreate --type nestjs --name sanpham --outputDir sanpham
npx katacreate --type nestjs --name donhang --outputDir donhang
npx katacreate --type nestjs --name banggia --outputDir banggia
npx katacreate --type nestjs --name giohang --outputDir giohang
npx katacreate --type nestjs --name khachhang --outputDir khachhang
npx katacreate --type nestjs --name nhacungcap --outputDir nhacungcap
npx katacreate --type nestjs --name dathang --outputDir dathang
npx katacreate --type nestjs --name kho --outputDir kho
npx katacreate --type nestjs --name phieukho --outputDir phieukho
npx katacreate --type nestjs --name role --outputDir role
npx katacreate --type nestjs --name permission --outputDir permission
npx katacreate --type nestjs --name nhomkhachhang --outputDir nhomkhachhang


Tình huống	Lệnh cần chạy
Thay đổi nhỏ (thêm/bớt cột)	npx bun prisma migrate dev --name update_schema
Thay đổi lớn (reset toàn bộ DB)	npx bun prisma migrate reset
Chỉ cần sync DB mà không tạo migration	npx prisma db push
Cập nhật Prisma Client	npx bun prisma generate


sanpham : id,title,slug,masp,giagoc,dvt,hinhanh,soluong,soluongkho,ghichu

donhhang:id,title,type,giohang,khachhang,madonhang,ngaygiao,ghichu,

giohang:id,title,donhang,sanpham:[{idSP,title,sldat,slgiao,slnhan,ttdat,ttgiao,ttnhan}]
(sldat:Số Lượng đặt,slgiao:số lượng giao,slnhan:số lượng nhận,ttdat:tổng tiền đặt,ttgiao:tổng tiền giao,ttnhan:tổng tiền nhận)

banggia:id,title,type,batdau,ketthuc,sanpham

sanpham-giohang:n-n

giohang-donhang:1-1

banggia-sanpham:n-n


nhacungcap: id,name,mancc,diachi,email,sdt,ghichu,isActive
dathang:id,madncc,title,status,isActive,nhacungcap,sanpham
1 nhacungcap - nhiều dathang
1 dathang - 1 nhacungcap
1 giohang - 1 dathang

model Giohang {
  id        String   @id @default(uuid())
  title     String
  donhang   Donhang  @relation(fields: [donhangId], references: [id])
  donhangId String   @unique
  order     Int
  isActive  Boolean  @default(false)
  sanpham   Giohangsanpham[]
}