-- CreateTable
CREATE TABLE "NhomKhachhang" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NhomKhachhang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KhachhangNhom" (
    "id" TEXT NOT NULL,
    "nhomId" TEXT NOT NULL,
    "khachhangId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KhachhangNhom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NhomKhachhang_name_key" ON "NhomKhachhang"("name");

-- AddForeignKey
ALTER TABLE "KhachhangNhom" ADD CONSTRAINT "KhachhangNhom_khachhangId_fkey" FOREIGN KEY ("khachhangId") REFERENCES "Khachhang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KhachhangNhom" ADD CONSTRAINT "KhachhangNhom_nhomId_fkey" FOREIGN KEY ("nhomId") REFERENCES "NhomKhachhang"("id") ON DELETE CASCADE ON UPDATE CASCADE;
