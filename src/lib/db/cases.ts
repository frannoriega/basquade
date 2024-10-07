'use server'
import { Prisma } from "@prisma/client"
import prisma from "../prisma"

async function getCases() {
  return await prisma.case.findMany({
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
  })
}

async function searchCases(term: string) {
  return await prisma.case.findMany({
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

type CaseWithBooks = Prisma.CaseGetPayload<{
  select: {
    id: true,
    name: true,
    description: true,
    categoryId: true,
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

async function getCaseById(id: number): Promise<CaseWithBooks | null> {
  return await prisma.case.findUnique({
    select: {
      id: true,
      name: true,
      description: true,
      categoryId: true,
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

type CreateCase = {
  name: string,
  description: string,
  categoryId: number
}

async function createCase(newCase: CreateCase) {
  return await prisma.case.create({
    data: {
      name: newCase.name,
      description: newCase.description,
      categoryId: newCase.categoryId
    }
  })
}

type UpdateCase = {
  id: number,
  name: string,
  description: string,
  categoryId: number,
  books: {
    description: string | null,
    start: number,
    end: number | null
  }[]
}

async function updateCase(col: UpdateCase) {
  return await prisma.case.update({
    where: {
      id: col.id
    },
    data: {
      name: col.name,
      description: col.description,
      categoryId: col.categoryId,
      books: {
        deleteMany: {},
        createMany: {
          data: col.books.map((b) => {
            return {
              description: b.description,
              startId: b.start,
              endId: b.end ?? b.start,
            }
          })
        }
      }
    },
  })
}

export { getCaseById, getCases, searchCases, createCase, updateCase }
