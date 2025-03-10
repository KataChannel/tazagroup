/*
  Warnings:

  - A unique constraint covering the columns `[SDT]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "SDT" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_SDT_key" ON "User"("SDT");
