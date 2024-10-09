/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Pending` table. All the data in the column will be lost.
  - You are about to drop the `Case` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CaseOnBook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CaseOnCase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `shelfId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shelfId` to the `Pending` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CaseOnBook" DROP CONSTRAINT "CaseOnBook_caseId_fkey";

-- DropForeignKey
ALTER TABLE "CaseOnBook" DROP CONSTRAINT "CaseOnBook_endId_fkey";

-- DropForeignKey
ALTER TABLE "CaseOnBook" DROP CONSTRAINT "CaseOnBook_startId_fkey";

-- DropForeignKey
ALTER TABLE "CaseOnCase" DROP CONSTRAINT "CaseOnCase_endId_fkey";

-- DropForeignKey
ALTER TABLE "CaseOnCase" DROP CONSTRAINT "CaseOnCase_startId_fkey";

-- DropForeignKey
ALTER TABLE "Pending" DROP CONSTRAINT "Pending_categoryId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "categoryId",
ADD COLUMN     "shelfId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pending" DROP COLUMN "categoryId",
ADD COLUMN     "shelfId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Case";

-- DropTable
DROP TABLE "CaseOnBook";

-- DropTable
DROP TABLE "CaseOnCase";

-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "Shelf" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" BYTEA NOT NULL,

    CONSTRAINT "Shelf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookMap" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "shelfId" INTEGER NOT NULL,

    CONSTRAINT "BookMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookMapRelation" (
    "mapId" INTEGER NOT NULL,
    "startId" INTEGER NOT NULL,
    "endId" INTEGER NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "AtlasRelation" (
    "startId" INTEGER NOT NULL,
    "endId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "AtlasRelation_pkey" PRIMARY KEY ("startId","endId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shelf_name_key" ON "Shelf"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BookMap_name_key" ON "BookMap"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BookMapRelation_mapId_startId_endId_key" ON "BookMapRelation"("mapId", "startId", "endId");

-- AddForeignKey
ALTER TABLE "BookMap" ADD CONSTRAINT "BookMap_shelfId_fkey" FOREIGN KEY ("shelfId") REFERENCES "Shelf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookMapRelation" ADD CONSTRAINT "BookMapRelation_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "BookMap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookMapRelation" ADD CONSTRAINT "BookMapRelation_startId_fkey" FOREIGN KEY ("startId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookMapRelation" ADD CONSTRAINT "BookMapRelation_endId_fkey" FOREIGN KEY ("endId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtlasRelation" ADD CONSTRAINT "AtlasRelation_startId_fkey" FOREIGN KEY ("startId") REFERENCES "BookMap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtlasRelation" ADD CONSTRAINT "AtlasRelation_endId_fkey" FOREIGN KEY ("endId") REFERENCES "BookMap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_shelfId_fkey" FOREIGN KEY ("shelfId") REFERENCES "Shelf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pending" ADD CONSTRAINT "Pending_shelfId_fkey" FOREIGN KEY ("shelfId") REFERENCES "Shelf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
