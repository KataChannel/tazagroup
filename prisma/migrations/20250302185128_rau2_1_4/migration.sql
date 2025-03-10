-- DropForeignKey
ALTER TABLE "Dathangsanpham" DROP CONSTRAINT "Dathangsanpham_dathangId_fkey";

-- DropForeignKey
ALTER TABLE "Donhangsanpham" DROP CONSTRAINT "Donhangsanpham_donhangId_fkey";

-- AddForeignKey
ALTER TABLE "Donhangsanpham" ADD CONSTRAINT "Donhangsanpham_donhangId_fkey" FOREIGN KEY ("donhangId") REFERENCES "Donhang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dathangsanpham" ADD CONSTRAINT "Dathangsanpham_dathangId_fkey" FOREIGN KEY ("dathangId") REFERENCES "Dathang"("id") ON DELETE CASCADE ON UPDATE CASCADE;
