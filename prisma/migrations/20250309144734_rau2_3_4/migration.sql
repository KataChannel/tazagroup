/*
  Warnings:

  - You are about to drop the `KhachhangNhom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KhachhangNhom" DROP CONSTRAINT "KhachhangNhom_khachhangId_fkey";

-- DropForeignKey
ALTER TABLE "KhachhangNhom" DROP CONSTRAINT "KhachhangNhom_nhomId_fkey";

-- DropTable
DROP TABLE "KhachhangNhom";

-- CreateTable
CREATE TABLE "_KhachhangNhom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_KhachhangNhom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_KhachhangNhom_B_index" ON "_KhachhangNhom"("B");

-- AddForeignKey
ALTER TABLE "_KhachhangNhom" ADD CONSTRAINT "_KhachhangNhom_A_fkey" FOREIGN KEY ("A") REFERENCES "Khachhang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KhachhangNhom" ADD CONSTRAINT "_KhachhangNhom_B_fkey" FOREIGN KEY ("B") REFERENCES "Nhomkhachhang"("id") ON DELETE CASCADE ON UPDATE CASCADE;
