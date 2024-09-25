/*
  Warnings:

  - Added the required column `display` to the `Lang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lang" ADD COLUMN     "display" TEXT NOT NULL;
