/*
  Warnings:

  - The primary key for the `CaseOnBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[caseId,startId,endId]` on the table `CaseOnBook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CaseOnBook" DROP CONSTRAINT "CaseOnBook_pkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CaseOnBook_caseId_startId_endId_key" ON "CaseOnBook"("caseId", "startId", "endId");
