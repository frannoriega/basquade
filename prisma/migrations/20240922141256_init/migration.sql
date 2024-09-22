-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "icon" BYTEA NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lang" (
    "id" SERIAL NOT NULL,
    "language" VARCHAR(15) NOT NULL,

    CONSTRAINT "Lang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "surname" VARCHAR(20) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorOnInstitution" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "instId" INTEGER NOT NULL,

    CONSTRAINT "AuthorOnInstitution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "file" BYTEA NOT NULL,
    "content" tsvector NOT NULL,
    "md5" TEXT NOT NULL,
    "langId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "pending" BOOLEAN NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorOnBook" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "AuthorOnBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Lang_language_key" ON "Lang"("language");

-- CreateIndex
CREATE UNIQUE INDEX "Book_md5_key" ON "Book"("md5");

-- AddForeignKey
ALTER TABLE "AuthorOnInstitution" ADD CONSTRAINT "AuthorOnInstitution_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorOnInstitution" ADD CONSTRAINT "AuthorOnInstitution_instId_fkey" FOREIGN KEY ("instId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_langId_fkey" FOREIGN KEY ("langId") REFERENCES "Lang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorOnBook" ADD CONSTRAINT "AuthorOnBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorOnBook" ADD CONSTRAINT "AuthorOnBook_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
