/*
  Warnings:

  - Added the required column `permanent` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "permanent" BOOLEAN NOT NULL;
