/*
  Warnings:

  - You are about to drop the column `language` on the `Lang` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pg_lang]` on the table `Lang` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pg_lang` to the `Lang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tesseract` to the `Lang` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Lang_language_key";

-- AlterTable
ALTER TABLE "Lang" DROP COLUMN "language",
ADD COLUMN     "pg_lang" VARCHAR(15) NOT NULL,
ADD COLUMN     "tesseract" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lang_pg_lang_key" ON "Lang"("pg_lang");
