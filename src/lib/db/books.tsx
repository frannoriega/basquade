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
  return prisma.$queryRaw`SELECT * FROM "Book" JOIN "Lang" on "Book".langId = "Lang".id where "Book".content @@ websearch_to_tsquery("Lang".language, '${term}')`

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
