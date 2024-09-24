-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "lastname" VARCHAR(63) NOT NULL,
    "dni" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseOnBook" (
    "caseId" INTEGER NOT NULL,
    "startId" INTEGER NOT NULL,
    "endId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "CaseOnBook_pkey" PRIMARY KEY ("caseId","startId","endId")
);

-- CreateTable
CREATE TABLE "CaseOnCase" (
    "startId" INTEGER NOT NULL,
    "endId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "CaseOnCase_pkey" PRIMARY KEY ("startId","endId")
);

-- AddForeignKey
ALTER TABLE "CaseOnBook" ADD CONSTRAINT "CaseOnBook_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseOnBook" ADD CONSTRAINT "CaseOnBook_startId_fkey" FOREIGN KEY ("startId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseOnBook" ADD CONSTRAINT "CaseOnBook_endId_fkey" FOREIGN KEY ("endId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseOnCase" ADD CONSTRAINT "CaseOnCase_startId_fkey" FOREIGN KEY ("startId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseOnCase" ADD CONSTRAINT "CaseOnCase_endId_fkey" FOREIGN KEY ("endId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
