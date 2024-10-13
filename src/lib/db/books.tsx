'use server'

import prisma from "@/lib/prisma";
import { BookInfo, BookUpdate, BookWithAll, BookWithAuthor, BookWithDisplayAuthor, CreateBook } from "@/types/books";
import * as crypto from 'crypto'

async function getBooks(page: number = 1, limit: number = 10): Promise<BookInfo[]> {
  return await prisma.book.findMany({
    select: {
      id: true,
      title: true,
      description: true
    },
    orderBy: {
      title: 'asc'
    },
    skip: Math.abs(page - 1) * limit,
    take: limit
  })
}

// Devuelve todos los libros no pendientes
// asociados a una estantería, o `null` si la estantería no existe.
async function getBooksByShelf(cat: number, page: number = 1, limit: number = 10): Promise<BookWithAuthor[]> {
  return prisma.book.findMany({
    include: {
      authors: {
        include: {
          author: true
        }
      }
    },
    where: {
      shelfId: cat,
      needs_revision: false,
    },
    orderBy: {
      title: "asc"
    },
    skip: Math.abs(page - 1) * limit,
    take: limit
  })
}

// Busca los libros en una estantería específica, basado
// en la frase (`term`) pasada como parámetro
async function searchBooks(
  term: string,
  filter: number | null = null,
  page: number = 1,
  limit: number = 0
): Promise<BookWithDisplayAuthor[]> {
  const offset = Math.abs(page - 1) * limit;
  return prisma.$queryRaw`SELECT b.id AS id, b.title AS title, b.description AS description, b.cover AS cover, array_agg(a.name || ' ' || a.surname || ' (' || a.email || ')') as authors FROM "Book" as b JOIN "Lang" as l on b."langId" = l.id JOIN "AuthorOnBook" as ab ON ab."bookId" = b.id JOIN "Author" as a ON ab."authorId" = a.id where b.content @@ websearch_to_tsquery(CAST(l.pg_lang AS regconfig), '${term}') AND b."shelfId" = COALESCE(${filter}, b."shelfId") AND b.needs_revision = false GROUP BY b.id ORDER BY b.title ASC LIMIT ${limit} OFFSET ${offset}`
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
      needs_revision: false
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
      needs_revision: true
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
      shelf: {
        select: {
          id: true,
          name: true
        }
      }
    },
    where: {
      needs_revision: true
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
      shelf: {
        select: {
          id: true,
          name: true
        }
      }
    },
    where: {
      needs_revision: true,
      id: id
    }
  })
}

async function updateBook(book: BookUpdate) {
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
      shelfId: book.shelf,
      needs_revision: false,
    },
  })
}

// TODO(fran)
async function createBook(book: CreateBook): Promise<string> {
  const file = Buffer.from(book.file)
  const md5 = crypto.createHash('md5').update(file).digest('hex')
  const message = await prisma.book.findUnique({
    where: {
      md5: md5
    }
  }).then((b) => b ? "El libro ya existe" : null)
  if (message) {
    return message
  }
  await prisma.pending.create({
    data: {
      title: book.title,
      description: book.description,
      file: file,
      md5: md5,
      langId: book.lang.id,
      shelfId: book.shelfId,
      authors: {
        create: book.authors.map((a) => { return { authorId: a } })
      }
    },
    include: {
      authors: true
    }
  })
  return "Guardado!"
}

async function deleteBooks(books: number[]) {
  const deleteAuthorRelations = prisma.authorOnBook.deleteMany({
    where: {
      bookId: {
        in: books
      }
    }
  })
  const deleteBookMapRelations = prisma.bookMapRelation.deleteMany({
    where: {
      OR: [
        {
          startId: {
            in: books
          }
        },
        {
          endId: {
            in: books
          }
        }
      ]
    }
  })
  const deleteBooks = prisma.book.deleteMany({
    where: {
      id: {
        in: books
      }
    }
  })

  return await prisma.$transaction([deleteAuthorRelations, deleteBookMapRelations, deleteBooks])
}

export { getBooks, getBooksByShelf, searchBooks, getPDF, getPendingPDF, getPending, getPendingById, updateBook, createBook, deleteBooks };
