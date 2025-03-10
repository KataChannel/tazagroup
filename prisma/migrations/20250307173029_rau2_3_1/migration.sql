/*
  Warnings:

  - You are about to drop the `Banggiakhachhang` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Banggiakhachhang" DROP CONSTRAINT "Banggiakhachhang_banggiaId_fkey";

-- DropForeignKey
ALTER TABLE "Banggiakhachhang" DROP CONSTRAINT "Banggiakhachhang_khachhangId_fkey";

-- DropTable
DROP TABLE "Banggiakhachhang";
