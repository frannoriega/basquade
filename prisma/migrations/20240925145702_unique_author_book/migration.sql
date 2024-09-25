/*
  Warnings:

  - A unique constraint covering the columns `[bookId,authorId]` on the table `AuthorOnBook` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AuthorOnBook_bookId_authorId_key" ON "AuthorOnBook"("bookId", "authorId");
