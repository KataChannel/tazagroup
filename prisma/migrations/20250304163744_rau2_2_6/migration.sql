/*
  Warnings:

  - You are about to drop the `NhomKhachhang` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KhachhangNhom" DROP CONSTRAINT "KhachhangNhom_nhomId_fkey";

-- DropTable
DROP TABLE "NhomKhachhang";

-- CreateTable
CREATE TABLE "Nhomkhachhang" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nhomkhachhang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nhomkhachhang_name_key" ON "Nhomkhachhang"("name");

-- AddForeignKey
ALTER TABLE "KhachhangNhom" ADD CONSTRAINT "KhachhangNhom_nhomId_fkey" FOREIGN KEY ("nhomId") REFERENCES "Nhomkhachhang"("id") ON DELETE CASCADE ON UPDATE CASCADE;
