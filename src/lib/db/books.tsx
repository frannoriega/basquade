import prisma from "@/lib/prisma";
import { Book, Prisma } from "@prisma/client";
import { exists } from "./categories";

type BookWithAuthorsAndLang = Prisma.BookGetPayload<{
  include: { authors: { include: { author: true }}, lang: true }
}>

// Devuelve todos los libros no pendientes
// asociados a una categoría, o `null` si la categoría no existe.
async function getBooks(cat: number, page: number = 1, limit: number = 10): Promise<Book[] | null> {
  return exists(cat).then((e) => {
    if (!e) {
      return new Promise((resolve) => resolve(null))
    } else {
      return prisma.book.findMany({
        where: {
          categoryId: cat,
          pending: false,
        },
        orderBy: {
          title: "asc"
        },
        skip: Math.abs(page-1) * limit,
        take: limit
      })
    }
  })
}

// Busca los libros basados en la frase (`term`) pasada
// como parámetro
async function searchBooks(term: string, page: number = 0, limit: number = 10): Promise<Book[]> {
  return prisma.$queryRaw`SELECT b.id, title FROM "Book" as b JOIN "Lang" as l on b."langId" = l.id where b.content @@ websearch_to_tsquery(CAST(l.language AS regconfig), '${term}') WHERE b.pending = false ORDER BY b.title ASC LIMIT ${limit} OFFSET ${Math.abs(page-1) * limit}`
}

// Busca los libros en una categoría específica, basado
// en la frase (`term`) pasada como parámetro
async function searchBooksFromCategory(
  term: string,
  filter: string,
  page: number = 0,
  limit: number = 0
): Promise<Book[]> {
  return prisma.$queryRaw`SELECT b.id, title  FROM "Book" as b JOIN "Lang" as l on b."langId" = l.id where b.content @@ websearch_to_tsquery(CAST(l.language AS regconfig), '${term}') AND b."categoryId" = ${filter} WHERE b.pending = false ORDER BY b.title ASC LIMIT ${limit} OFFSET ${Math.abs(page-1) * limit}`
}

// Devuelve el PDF asociado al libro, o `null` en caso
// de que no exista
async function getPDF(id: number): Promise<Buffer | null> {
  return prisma.book.findUnique({
    select: {
      file: true
    },
    where: {
      id: id,
      pending: false
    }
  }).then((book) => book ? book.file : null)
}

// Devuelve algún PDF que esté pendiente de corrección,
// o `null` si no hay ninguno pendiente
async function getPendingPDF(id: number): Promise<Buffer | null> {
  return prisma.book.findUnique({
    select: {
      file: true
    },
    where: {
      id: id,
      pending: true
    }
  }).then((book) => book ? book.file : null)
}

async function getPendingWithAuthor(): Promise<BookWithAuthorsAndLang | null> {
  return prisma.book.findFirst({
    where: {
      pending: true
    },
    include: {
      authors: {
        include: {
          author: true
        }
      },
      lang: true
    }
  })
}

export { getBooks, searchBooks, searchBooksFromCategory, getPDF, getPendingPDF, getPendingWithAuthor };
export type { BookWithAuthorsAndLang }
