import prisma from "@/lib/prisma";
import { Book } from "@prisma/client";
import { exists } from "./categories";

async function getBooks(cat: number): Promise<Book[] | null> {
  return exists(cat).then((e) => {
    if (!e) {
      return new Promise((resolve) => resolve(null))
    } else {
      return prisma.book.findMany({
        where: {
          categoryId: cat,
        }
      })
    }
  })
}

async function searchBooks(term: string): Promise<Book[]> {
  return prisma.$queryRaw`SELECT * FROM "Book" as b JOIN "Lang" as l on b."langId" = l.id where b.content @@ websearch_to_tsquery(CAST(l.language AS regconfig), '${term}')`
}

async function getPDF(id: number): Promise<Buffer> {
  return prisma.book.findUniqueOrThrow({
    select: {
      file: true
    },
    where: {
      id: id
    }
  }).then((book) => book.file)
}

export { getBooks, searchBooks, getPDF };
