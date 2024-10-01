/*
  Warnings:

  - You are about to drop the column `pending` on the `Book` table. All the data in the column will be lost.
  - Added the required column `needs_revision` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "pending",
ADD COLUMN     "needs_revision" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Pending" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "file" BYTEA NOT NULL,
    "md5" TEXT NOT NULL,
    "langId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Pending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorOnPending" (
    "id" SERIAL NOT NULL,
    "pendingId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "AuthorOnPending_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pending_md5_key" ON "Pending"("md5");

-- CreateIndex
CREATE UNIQUE INDEX "AuthorOnPending_pendingId_authorId_key" ON "AuthorOnPending"("pendingId", "authorId");

-- AddForeignKey
ALTER TABLE "Pending" ADD CONSTRAINT "Pending_langId_fkey" FOREIGN KEY ("langId") REFERENCES "Lang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pending" ADD CONSTRAINT "Pending_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorOnPending" ADD CONSTRAINT "AuthorOnPending_pendingId_fkey" FOREIGN KEY ("pendingId") REFERENCES "Pending"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorOnPending" ADD CONSTRAINT "AuthorOnPending_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
