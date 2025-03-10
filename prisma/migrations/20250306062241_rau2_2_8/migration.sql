-- CreateEnum
CREATE TYPE "StatusDonhang" AS ENUM ('dadat', 'dagiao', 'danhan', 'huy');

-- AlterTable
ALTER TABLE "Donhang" ADD COLUMN     "status" "StatusDonhang" NOT NULL DEFAULT 'dadat';
