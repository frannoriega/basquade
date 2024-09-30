'use server'

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type BookWithAll = Prisma.BookGetPayload<{
  select: { id: true, title: true, description: true, authors: { select: { author: true } }, lang: true, category: { select: { id: true, name: true } } }
}>

type BookWithDisplayAuthor = {
  id: number,
  title: string,
  description: string,
  cover: Buffer,
  authors: string[]
}

type BookWithAuthor = Prisma.BookGetPayload<{
  include: { authors: { include: { author: true } } }
}>

// Devuelve todos los libros no pendientes
// asociados a una categoría, o `null` si la categoría no existe.
async function getBooks(cat: number, page: number = 1, limit: number = 10): Promise<BookWithAuthor[]> {
  return prisma.book.findMany({
    include: {
      authors: {
        include: {
          author: true
        }
      }
    },
    where: {
      categoryId: cat,
      pending: false,
    },
    orderBy: {
      title: "asc"
    },
    skip: Math.abs(page - 1) * limit,
    take: limit
  })
}

// Busca los libros basados en la frase (`term`) pasada
// como parámetro
async function searchBooks(term: string, page: number = 1, limit: number = 10): Promise<BookWithDisplayAuthor[]> {
  const offset = Math.abs(page - 1) * limit;
  return prisma.$queryRaw`SELECT b.id AS id, b.title AS title, b.description AS description, b.cover AS cover, array_agg(a.name || ' ' || a.surname || ' (' || a.email || ')') as authors FROM "Book" as b JOIN "Lang" as l on b."langId" = l.id JOIN "AuthorOnBook" as ab ON ab."bookId" = b.id JOIN "Author" as a ON ab."authorId" = a.id where b.content @@ websearch_to_tsquery(CAST(l.language AS regconfig), '${term}') AND b.pending = false GROUP BY b.id ORDER BY b.title ASC LIMIT ${limit} OFFSET ${offset}`
}

// Busca los libros en una categoría específica, basado
// en la frase (`term`) pasada como parámetro
async function searchBooksFromCategory(
  term: string,
  filter: string,
  page: number = 1,
  limit: number = 0
): Promise<BookWithDisplayAuthor[]> {
  const offset = Math.abs(page - 1) * limit;
  return prisma.$queryRaw`SELECT b.id AS id, b.title AS title, b.description AS description, b.cover AS cover, array_agg(a.name || ' ' || a.surname || ' (' || a.email || ')') as authors FROM "Book" as b JOIN "Lang" as l on b."langId" = l.id JOIN "AuthorOnBook" as ab ON ab."bookId" = b.id JOIN "Author" as a ON ab."authorId" = a.id where b.content @@ websearch_to_tsquery(CAST(l.language AS regconfig), '${term}') AND b."categoryId" = ${filter} AND b.pending = false GROUP BY b.id ORDER BY b.title ASC LIMIT ${limit} OFFSET ${offset}`
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

async function getPending(): Promise<BookWithAll[]> {
  return prisma.book.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      authors: {
        select: {
          author: true
        }
      },
      lang: true,
      category: {
        select: {
          id: true,
          name: true
        }
      }
    },
    where: {
      pending: true
    }
  })
}

async function getPendingById(id: number): Promise<BookWithAll | null> {
  return prisma.book.findUnique({
    select: {
      id: true,
      title: true,
      description: true,
      authors: {
        select: {
          author: true
        }
      },
      lang: true,
      category: {
        select: {
          id: true,
          name: true
        }
      }
    },
    where: {
      pending: true,
      id: id
    }
  })
}
type BookUpdate = {
  id: number,
  title: string,
  description: string,
  lang: number,
  category: number,
  authors: number[]
}

async function updatePendingBook(book: BookUpdate) {
  return prisma.book.update({
    select: {
      id: true
    },
    where: {
      id: book.id
    },
    data: {
      title: book.title,
      description: book.description,
      authors: {
        deleteMany: {},
        create: book.authors.map((a) => { return { author: { connect: { id: a } } } })
      },
      langId: book.lang,
      categoryId: book.category,
      pending: false,
    },
  })
}

export { getBooks, searchBooks, searchBooksFromCategory, getPDF, getPendingPDF, getPending, getPendingById, updatePendingBook };
