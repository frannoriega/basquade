'use server'
import { Prisma } from "@prisma/client"
import prisma from "../prisma"

async function getBookMapCount(): Promise<number> {
  return await prisma.bookMap.count({})
}

async function getBookMaps(): Promise<BookMap[]> {
  return await prisma.bookMap.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          books: true
        }
      }
    }
  }).then(books => books.map(b => {
      return {
        id: b.id,
        name: b.name,
        description: b.description,
        book_count: b._count.books
      }
    }))
}

async function searchBookMaps(term: string) {
  return await prisma.bookMap.findMany({
    where: {
      OR: [
        {
          name: {
            contains: term,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: term,
            mode: 'insensitive'
          }
        }
      ]
    }
  })
}

type BookMapWithBooks = Prisma.BookMapGetPayload<{
  select: {
    id: true,
    name: true,
    description: true,
    shelfId: true,
    books: {
      select: {
        description: true,
        start: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
        end: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
      }
    }
  }
}>

async function getBookMapById(id: number): Promise<BookMapWithBooks | null> {
  return await prisma.bookMap.findUnique({
    select: {
      id: true,
      name: true,
      description: true,
      shelfId: true,
      books: {
        select: {
          description: true,
          start: {
            select: {
              id: true,
              title: true,
              description: true
            }
          },
          end: {
            select: {
              id: true,
              title: true,
              description: true
            }
          },
        }
      }
    },
    where: {
      id: id
    }
  })
}

type CreateBookMap = {
  name: string,
  description: string,
  shelfId: number
}

async function createBookMap(newBookMap: CreateBookMap) {
  return await prisma.bookMap.create({
    data: {
      name: newBookMap.name,
      description: newBookMap.description,
      shelfId: newBookMap.shelfId
    }
  })
}

type UpdateBookMap = {
  id: number,
  name: string,
  description: string,
  shelfId: number,
  books: {
    description: string | null,
    start: number,
    end: number | null
  }[]
}

async function updateBookMap(col: UpdateBookMap) {
  return await prisma.bookMap.update({
    where: {
      id: col.id
    },
    data: {
      name: col.name,
      description: col.description,
      shelfId: col.shelfId,
      books: {
        deleteMany: {},
        createMany: {
          data: col.books.map((b) => {
            return {
              description: b.description ?? '',
              startId: b.start,
              endId: b.end ?? b.start,
            }
          })
        }
      }
    },
  })
}

export { getBookMapCount, getBookMapById, getBookMaps, searchBookMaps, createBookMap, updateBookMap }
