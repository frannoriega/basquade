import prisma from "@/lib/prisma";
import { Book } from "@prisma/client";

async function getBooks(cat: number): Promise<Book[]> {
  return prisma.book.findMany({
    where: {
      categoryId: cat,
    }
  })
}

async function searchBooks(term: string): Promise<Book[]> {
  return prisma.$queryRaw`SELECT * FROM "Book" JOIN "Lang" on "Book".langId = "Lang".id where "Book".content @@ websearch_to_tsquery("Lang".language, '${term}')`

}

export { getBooks, searchBooks };
